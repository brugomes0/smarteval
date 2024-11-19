<script lang="ts">
    import LL from "../../i18n/i18n-svelte"
    import ModalComponent from "./ModalComponent.svelte"
    import toast from "svelte-french-toast"
    import { convertUtcToLocalDate } from "../../helpers/date"
    import { onMount } from "svelte"
    import { requestToApi } from "../../helpers/api"
    import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, CircleCheckIcon, CircleXIcon, FolderIcon, SearchIcon, Trash2Icon, UserCircleIcon, UserIcon, XIcon } from "lucide-svelte"
    import EmployeesDepartmentsComponent from "./Employees&DepartmentsComponent.svelte";
    import { validateSubmission } from "../../helpers/validationSubmission";

    export let allowAddSubmission: boolean
    export let allowDeleteSubmission: boolean
    export let evaluationId: string
    export let evaluationType: string
    export let lang: string
    export let reloadProgressBar: boolean
    export let reviewStatus: string

    let deleteSubmissionId: string = ""
    let departments: DepartmentData[] = []
    let departmentsPage: number = 1
    let employees: InfoEmployeeData[] = []
    let employeesPage: number = 1
    let employeesPageSize: number = 10
    let employeesSearchInput: string = ""
    let employeesTotal: number = 0
    let error: string = ""
    let firstElement: number = 0
    let input: string = ""
    let loading: boolean = true
    let lastElement: number = 0
    let modalDeleteIsOpen: boolean = false
    let modalCreateIsOpen: boolean = false
    let newSubmission: CreateSubmissionData = { evaluatedDepartmentId: null, evaluatedEmployeeId: null, evaluatorDepartmentId: null, evaluatorEmployeeId: null }
    let page: number = 1
    let pageSize: number = 5
    let status: string = "all"
    let submissions: SubmissionData[] = []
    let timeoutId: any
    let total: number = 0

    async function createSubmission() {
        let error = validateSubmission(newSubmission, evaluationType)
        if (error != "") { toast.error(error); return }

        let response = await requestToApi("POST", `SmartEval/Submissions?evaluationId=${evaluationId}`, newSubmission)
        if (response.statusCode === 201) {
            toast.success($LL.SubmissionModal.ToastCreate())
            page = 1
            handleInputChanges()
            reloadProgressBar = true
        } else {
            toast.error($LL.SubmissionModal.ToastCreateError())
        }
        modalCreateIsOpen = false
        employeesSearchInput = ""
        newSubmission = { evaluatedDepartmentId: null, evaluatedEmployeeId: null, evaluatorDepartmentId: null, evaluatorEmployeeId: null }
    }

    async function deleteSubmission(submissionId: string) {
        let response = await requestToApi("DELETE", `SmartEval/Submissions/${submissionId}`)
        if (response.statusCode === 200) {
            toast.success($LL.SubmissionModal.ToastDelete())
            page = 1
            handleInputChanges()
            reloadProgressBar = true
        } else {
            toast.error($LL.SubmissionModal.ToastDeleteError())
        }
        modalDeleteIsOpen = false
    }

    async function getDepartments() {
        let response = await requestToApi("GET", `Departments?page=${departmentsPage}&pageSize=10`)
        if (response.statusCode === 200) {
            departments = response.data.map((item: DepartmentData) => ({
                departmentId: item.departmentId,
                departmentDescription: item.departmentDescription,
                departmentParentId: item.departmentParentId,
                employees: [],
                totalEmployees: null,
                isOpen: false
            }))
        }
    }

    async function getEmployees() {
        let response = await requestToApi("GET", `Employees?page=${employeesPage}&pageSize=${employeesPageSize}&name=${employeesSearchInput}`)
        if (response.statusCode === 200) {
            employees = response.data
            employeesTotal = response.totalCount
        }
    }

    async function getSubmissions() {
        let response = await requestToApi("GET", `SmartEval/Submissions?evaluationId=${evaluationId}&page=${page}&pageSize=${pageSize}&name=${input}&submitted=${status}`)
        if (response.statusCode === 200) {
            submissions = response.data
            total = response.totalCount
        } else {
            error = response.error
        }
        loading = false
    }

    function changePage(change: string) {
        loading = true
        if (change === 'increment' && page < Math.ceil(total / pageSize)) {
            page++
        } else if (change === 'decrement' && page > 1) {
            page--
        }
        debounce(getSubmissions, 500)
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function handleInputChanges() {
        loading = true
        page = 1
        debounce(getSubmissions, 1000)
    }

    function openModalCreate() {
        modalCreateIsOpen = true
        if (departments.length === 0) {
            if (evaluationType != "Interdepartamental") getEmployees()
            else { getDepartments() }
        }
    }

    function openModalDelete(id: string) {
        modalDeleteIsOpen = true
        deleteSubmissionId = id
    }

    onMount(async () => { getSubmissions() })

    $: {
        firstElement = Math.min((page - 1) * pageSize + 1, total)
        lastElement = Math.min(page * pageSize, total)
    }
</script>

<!-- MODAL TO DELETE SUBMISSION -->
{#if modalDeleteIsOpen}
    <ModalComponent on:save={() => deleteSubmission(deleteSubmissionId)}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.SubmissionModal.Title()}</span>
            <button on:click={() => modalDeleteIsOpen = false} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.SubmissionModal.Description()}</span>
        </div>
    </ModalComponent>
{/if}

<!-- MODAL TO CREATE SUBMISSION MANUALLY -->
{#if modalCreateIsOpen}
    <EmployeesDepartmentsComponent bind:evaluationType bind:modalCreateIsOpen bind:newSubmission on:save={createSubmission} />
{/if}

{#if !error}
    <div class="flex flex-col">
        <div class="border flex flex-col mx-5 my-2 rounded border-gray-300">
            <div class="border-b rounded-t bg-gray-100 border-gray-300">
                <div class="border-b flex gap-x-2 h-12 items-center justify-end px-3 border-gray-300">
                    <div class="relative hidden sm:flex items-center w-[200px]">
                        <span class="absolute left-2">
                            <svelte:component this={SearchIcon} size={20} />
                        </span>
                        <input bind:value={input} on:input={handleInputChanges} class="border pl-8 py-1 rounded text-sm w-full border-gray-300" placeholder={$LL.SubmissionModal.Search()} type="text" />
                    </div>
                    <select bind:value={status} on:change={handleInputChanges} class="border px-2 py-1 rounded text-sm border-gray-300">
                        <option value="all">{$LL.SubmissionModal.SelectAll()}</option>
                        <option value="yes">{$LL.SubmissionModal.SelectYes()}</option>
                        <option value="no">{$LL.SubmissionModal.SelectNo()}</option>
                    </select>
                    {#if allowAddSubmission && reviewStatus == "Active"}
                        <button on:click={() => openModalCreate()} class="font-medium px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">{$LL.SubmissionModal.CreateSubmission()}</button>
                    {/if}
                </div>
                <div class="flex h-10 items-center justify-between px-2 py-1">
                    <span class="font-medium text-sm w-[120px] xl:w-[200px] 2xl:w-[300px] text-gray-400">{$LL.SubmissionModal.Evaluator()}</span>
                    <span class="font-medium text-sm w-[120px] xl:w-[200px] 2xl:w-[300px] text-gray-400">{$LL.SubmissionModal.Evaluated()}</span>
                    <span class="font-medium text-sm w-[120px] xl:w-[200px] 2xl:w-[300px] text-gray-400">{$LL.SubmissionModal.Date()}</span>
                    <span class="font-medium text-sm w-20 text-gray-400">{$LL.SubmissionModal.Submitted()}</span>
                    {#if allowDeleteSubmission}<span class="w-5"></span>{/if}
                </div>
            </div>
            <div class="flex flex-col h-[200px]">
                {#if loading}
                    <span class="px-4 py-2">{$LL.SubmissionModal.Loading()}</span>
                {:else}
                    {#if submissions.length > 0}
                        {#each submissions as submission, index}
                            <div class="flex h-10 items-center justify-between px-2 py-1 {index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} {submissions.length == index + 1 ? 'rounded-b' : ''}">
                                <p class="flex gap-x-[5px] items-center text-xs w-[120px] xl:w-[200px] 2xl:w-[300px]">
                                    <svelte:component this={UserIcon} class="w-5 h-5" />
                                    <span class="w-[95px] xl:w-[175px] 2xl:w-[275px] line-clamp-2 overflow-ellipsis" title={submission.evaluatorEmployee}>{submission.evaluatorEmployee}</span>
                                </p>
                                <p class="flex gap-x-[5px] items-center text-xs w-[120px] xl:w-[200px] 2xl:w-[300px]">
                                    <svelte:component this={submission.evaluatedEmployee ? UserIcon : FolderIcon} class="w-5 h-5" />
                                    <span class="w-[95px] xl:w-[175px] 2xl:w-[275px] line-clamp-2 overflow-ellipsis" title={submission.evaluatedEmployee || submission.evaluatedDepartment}>{submission.evaluatedEmployee || submission.evaluatedDepartment}</span>
                                </p>
                                <p class="flex items-center text-xs w-[120px] xl:w-[200px] 2xl:w-[300px]">
                                    <span>{submission.isAnswered ? convertUtcToLocalDate(submission.submissionDate, lang) : '-'}</span>
                                </p>
                                <span class="flex items-center justify-center w-20 {submission.isAnswered ? 'text-green-500' : 'text-red-500'}">
                                    <svelte:component this={submission.isAnswered ? CircleCheckIcon : CircleXIcon} size={20} />
                                </span>
                                {#if allowDeleteSubmission}
                                    <button on:click={() => openModalDelete(submission.submissionId)} class="flex items-center w-5 h-5 hover:text-red-500" title={$LL.SubmissionModal.Remove()}>
                                        <svelte:component this={Trash2Icon} size={20} />
                                    </button>
                                {/if}
                            </div>
                        {/each}
                    {:else}
                        <span class="px-4 py-2">{$LL.SubmissionModal.NoSubmissions()}</span>
                    {/if}
                {/if}
            </div>
        </div>
        <div class="flex justify-between mx-5 text-xs">
            <span>{$LL.SubmissionModal.ShowingItemsLabel({ firstElement, pageSize: lastElement, total })}</span>
            <div class="flex gap-x-2">
                <button on:click={() => { if (page != 1) changePage('decrement')}} class="border rounded border-gray-300 hover:bg-gray-100">
                    <svelte:component this={ChevronLeftIcon} />
                </button>
                <button on:click={() => { if (lastElement != total) changePage('increment')}} class="border rounded border-gray-300 hover:bg-gray-100">
                    <svelte:component this={ChevronRightIcon} />
                </button>
            </div>
        </div>
    </div>
{:else}
    <span class="border-2 font-medium mx-4 my-2 px-4 py-2 rounded text-xs bg-red-500 border-red-600 text-white">{$LL.SubmissionModal.Error()}</span>
{/if}