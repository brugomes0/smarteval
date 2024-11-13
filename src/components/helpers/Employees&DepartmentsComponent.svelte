<script lang="ts">
    import { ChevronLeftIcon, ChevronRightIcon, FolderIcon, SearchIcon, UserIcon, XIcon } from "lucide-svelte"
    import { Steps } from "svelte-steps"
    import { createEventDispatcher, onMount } from "svelte"
    import { requestToApi } from "../../helpers/api"
    import LL from "../../i18n/i18n-svelte"
    import { validateSubmission } from "../../helpers/validationSubmission";
    import toast from "svelte-french-toast";

    export let evaluationType: string
    export let modalCreateIsOpen: boolean
    export let newSubmission: CreateSubmissionData

    let dispatch = createEventDispatcher()
    let confirmChanges = () => { dispatch('save') }

    let chefias: any = []
    let current: number = 0
    let departments: DepartmentData[] = []
    let departmentsPage: number = 1
    let departmentsPageSize: number = 10
    let departmentsTotal: number = 0
    let employees: InfoEmployeeData[] = []
    let employeesPage: number = 1
    let employeesPageSize: number = 10
    let employeesSearchInput: string = ""
    let employeesTotal: number = 0
    let firstElement: number = 0
    let lastElement: number = 0
    let steps = evaluationType != "Interdepartamental" ? 
        [{ text: $LL.SubmissionModal.Evaluator() }, { text: $LL.SubmissionModal.Evaluated() }] : 
        [{ text: $LL.SubmissionModal.EvaluatorDep() }, { text: $LL.SubmissionModal.Evaluator() }, { text: $LL.SubmissionModal.EvaluatedDep() }]


    async function getChefias() {
        if (newSubmission.evaluatorDepartmentId == null) return -1

        let response = await requestToApi("GET", `Departments/${newSubmission.evaluatorDepartmentId}/Supervisors`)
        if (response.statusCode === 200) { chefias = response.data }
    }

    async function getDepartments() {
        let response = await requestToApi("GET", `Departments?page=${departmentsPage}&pageSize=${departmentsPageSize}`)
        if (response.statusCode === 200) {
            departments = response.data
            departmentsTotal = response.totalCount
            firstElement = Math.min((departmentsPage - 1) * departmentsPageSize + 1, departmentsTotal)
            lastElement = Math.min(departmentsPage * departmentsPageSize, departmentsTotal)
        }
    }

    async function getEmployees() {
        let response = await requestToApi("GET", `Employees?page=${employeesPage}&pageSize=${employeesPageSize}&name=${employeesSearchInput}`)
        if (response.statusCode === 200) {
            employees = response.data
            employeesTotal = response.totalCount
            firstElement = Math.min((employeesPage - 1) * employeesPageSize + 1, employeesTotal)
            lastElement = Math.min(employeesPage * employeesPageSize, employeesTotal)
        }
    }

    async function handleChangePage(orientation: string) {
        if (orientation === "back" && current >= 1 && evaluationType != "Interdepartamental") { employeesPage = 1; getEmployees(); current-- }
        else if (orientation === "next" && current < steps.length - 1 && evaluationType != "Interdepartamental") { employeesPage = 1; getEmployees(); current++}
        else if (orientation === "back" && current == 1 && evaluationType == "Interdepartamental") { departmentsPage = 1; getDepartments(); current-- }
        else if (orientation === "back" && current == 2 && evaluationType == "Interdepartamental") { getChefias(); current-- }
        else if (orientation === "next" && current == 1 && evaluationType == "Interdepartamental") { departmentsPage = 1; getDepartments(); current++ }
        else if (orientation === "next" && current == 0 && evaluationType == "Interdepartamental") {
            console.log(newSubmission)
            if (newSubmission.evaluatorDepartmentId == null) { return -1 }
            else { getChefias(); current++ }
        }
        else if (orientation === "next" && current === steps.length - 1) confirmChanges
    }

    onMount(async () => {
        if (evaluationType != "Interdepartamental") getEmployees()
        else { getDepartments() }
    })
</script>

<div class="fixed top-0 left-0 bg-black bg-opacity-75 flex flex-col pt-5 w-screen h-full transition-opacity duration-500 z-40">
    <div class="flex flex-col gap-y-2 mx-auto p-2 rounded w-[90%] lg:w-[800px] bg-gray-100">
        <div class="flex items-center justify-between" id="header">
            <span class="font-medium text-base text-gray-800">{$LL.SubmissionModal.CreateSubmission()}</span>
            <button on:click={() => modalCreateIsOpen = false} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <hr>
        <div class="flex flex-col gap-y-4" id="content">
            <div class="hidden lg:flex justify-center text-xs text-gray-400">
                <div class="w-[500px]">
                    <Steps clickable={true} size="1.6rem" {steps} bind:current />
                </div>
            </div>
            {#if current == 0 && evaluationType != "Interdepartamental"}
                <div class="flex flex-col gap-y-2">
                    <span class="font-medium text-sm text-gray-800">{$LL.EmployeesDepartments.ChooseEvaluator()}</span>
                    <div class="flex flex-col gap-y-1">
                        {#each employees as employee}
                            <label class="cursor-pointer flex gap-x-2 items-center px-2 rounded hover:bg-gray-200">
                                <input bind:group={newSubmission.evaluatorEmployeeId} type="radio" value={employee.employeeId} />
                                <svelte:component this={UserIcon} size={20} />
                                <div class="flex flex-col">
                                    <span class="text-xs text-gray-800">{employee.employeeName}</span>
                                    <span class="text-xs text-gray-400">{employee.departmentName}</span>
                                </div>
                            </label>
                        {/each}
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-800">{$LL.EmployeesDepartments.ShowingItemsLabel({ firstElement, pageSize: lastElement, total: employeesTotal })}</span>
                        <div class="flex gap-x-2 items-center">
                            <button on:click={() => { if (employeesPage > 1) employeesPage--; getEmployees() }} class="border rounded border-gray-300 hover:bg-gray-200">
                                <svelte:component this={ChevronLeftIcon} size={20} />
                            </button>
                            <button on:click={() => { if (employeesTotal != lastElement) employeesPage++; getEmployees() }} class="border rounded border-gray-300 hover:bg-gray-200">
                                <svelte:component this={ChevronRightIcon} size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            {:else if current == 0 && evaluationType == "Interdepartamental"}
                <div class="flex flex-col gap-y-2">
                    <span class="font-medium text-sm text-gray-800">{$LL.EmployeesDepartments.ChooseEvaluatorDep()}</span>
                    <div class="flex flex-col gap-y-1">
                        {#each departments as department}
                            <label class="cursor-pointer flex gap-x-2 items-center px-2 py-2 rounded hover:bg-gray-200">
                                <input bind:group={newSubmission.evaluatorDepartmentId} type="radio" value={department.departmentId} />
                                <svelte:component this={FolderIcon} size={20} />
                                <span class="text-xs text-gray-800">{department.departmentDescription}</span>
                            </label>
                        {/each}
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-800">{$LL.EmployeesDepartments.ShowingItemsLabel({ firstElement, pageSize: lastElement, total: departmentsTotal })}</span>
                        {#if departmentsTotal > 10}
                            <div class="flex gap-x-2 items-center">
                                <button on:click={() => { if (departmentsPage > 1) departmentsPage--; getDepartments() }} class="border rounded border-gray-300 hover:bg-gray-200">
                                    <svelte:component this={ChevronLeftIcon} size={20} />
                                </button>
                                <button on:click={() => { if (departmentsTotal != lastElement) departmentsPage++; getDepartments() }} class="border rounded border-gray-300 hover:bg-gray-200">
                                    <svelte:component this={ChevronRightIcon} size={20} />
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            {:else if current == 1 && evaluationType != "Interdepartamental"}
                <div class="flex flex-col gap-y-2">
                    <span class="font-medium text-sm text-gray-800">{$LL.EmployeesDepartments.ChooseEvaluated()}</span>
                    <div class="flex flex-col gap-y-1">
                        {#each employees as employee}
                            <label class="cursor-pointer flex gap-x-2 items-center px-2 rounded hover:bg-gray-200">
                                <input bind:group={newSubmission.evaluatedEmployeeId} type="radio" value={employee.employeeId} />
                                <svelte:component this={UserIcon} size={20} />
                                <div class="flex flex-col">
                                    <span class="text-xs text-gray-800">{employee.employeeName}</span>
                                    <span class="text-xs text-gray-400">{employee.departmentName}</span>
                                </div>
                            </label>
                        {/each}
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-800">{$LL.EmployeesDepartments.ShowingItemsLabel({ firstElement, pageSize: lastElement, total: employeesTotal })}</span>
                        <div class="flex gap-x-2 items-center">
                            <button on:click={() => { if (employeesPage > 1) employeesPage--; getEmployees() }} class="border rounded border-gray-300 hover:bg-gray-200">
                                <svelte:component this={ChevronLeftIcon} size={20} />
                            </button>
                            <button on:click={() => { if (employeesTotal != lastElement) employeesPage++; getEmployees() }} class="border rounded border-gray-300 hover:bg-gray-200">
                                <svelte:component this={ChevronRightIcon} size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            {:else if current == 1 && evaluationType == "Interdepartamental"}
                <div class="flex flex-col gap-y-2">
                    <span class="font-medium text-sm text-gray-800">{$LL.EmployeesDepartments.ChooseSupervisor()}</span>
                    <div class="flex flex-col gap-y-1">
                        {#each chefias as chefia}
                            <label class="cursor-pointer flex gap-x-2 items-center px-2 py-2 rounded hover:bg-gray-200">
                                <input bind:group={newSubmission.evaluatorEmployeeId} type="radio" value={chefia.employeeId} />
                                <svelte:component this={UserIcon} size={20} />
                                <span class="text-xs text-gray-800">{chefia.employeeName}</span>
                            </label>
                        {/each}
                    </div>
                </div>
            {:else if current == 2 && evaluationType == "Interdepartamental"}
                <div class="flex flex-col gap-y-2">
                    <span class="font-medium text-sm text-gray-800">{$LL.EmployeesDepartments.ChooseEvaluatedDep()}</span>
                    <div class="flex flex-col gap-y-1">
                        {#each departments as department}
                            <label class="cursor-pointer flex gap-x-2 items-center px-2 py-2 rounded hover:bg-gray-200">
                                <input bind:group={newSubmission.evaluatedDepartmentId} type="radio" value={department.departmentId} />
                                <svelte:component this={FolderIcon} size={20} />
                                <span class="text-xs text-gray-800">{department.departmentDescription}</span>
                            </label>
                        {/each}
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-800">{$LL.EmployeesDepartments.ShowingItemsLabel({ firstElement, pageSize: lastElement, total: departmentsTotal })}</span>
                        {#if departmentsTotal > 10}
                            <div class="flex gap-x-2 items-center">
                                <button on:click={() => { if (departmentsPage > 1) departmentsPage--; getDepartments() }} class="border rounded border-gray-300 hover:bg-gray-200">
                                    <svelte:component this={ChevronLeftIcon} size={20} />
                                </button>
                                <button on:click={() => { if (departmentsTotal != lastElement) departmentsPage++; getDepartments() }} class="border rounded border-gray-300 hover:bg-gray-200">
                                    <svelte:component this={ChevronRightIcon} size={20} />
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
        <hr>
        <div class="flex items-center justify-between">
            <button on:click={() => handleChangePage("back")} class="border font-medium px-2 py-1 rounded text-sm border-gray-300 hover:bg-gray-200 text-gray-800">{$LL.EmployeesDepartments.GoBack()}</button>
            {#if current != steps.length - 1}
                <button on:click={() => handleChangePage("next")} class="font-medium px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">{$LL.EmployeesDepartments.Next()}</button>
            {:else}
                <button on:click={confirmChanges} class="font-medium px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">{$LL.EmployeesDepartments.Save()}</button>
            {/if}
        </div>
    </div>
</div>