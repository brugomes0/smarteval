<!-- COMPONENT TO ASSOCIATE EMPLOYEES AND DEPARTMENTS TO REVIEW BEING CREATED -->
<script lang="ts">
    import LL from "../../i18n/i18n-svelte"
    import { onMount } from "svelte"
    import { requestToApi } from "../../helpers/api"
    import { ChevronDownIcon, ChevronUpIcon, FolderIcon, MinusIcon, UserIcon, UsersIcon } from "lucide-svelte"

    export let selectedDepartments: number[]
    export let selectedEmployees: number[]

    let departments: DepartmentData[] = []

    async function getDepartments() {
        let response = await requestToApi("GET", `Departments`)
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

    async function getEmployeesFromDepartment(id: number) {
        const departmentIndex = departments.findIndex(dep => dep.departmentId == id)
        if (departmentIndex !== -1 && departments[departmentIndex].totalEmployees === null) {
            let response = await requestToApi("GET", `Departments/${id}/Employees`)
            if (response.statusCode === 200) {
                departments[departmentIndex].employees = response.data
                departments[departmentIndex].totalEmployees = departments[departmentIndex].employees.length
            }
        }
    }

    function selectAllEmployees(department: DepartmentData) {
        const employeeIds = department.employees.map(employee => employee.employeeId)
        const allSelected = employeeIds.every(id => selectedEmployees.includes(id))

        if (allSelected) {
            selectedEmployees = selectedEmployees.filter(id => !employeeIds.includes(id))
        } else {
            selectedEmployees = [...new Set([...selectedEmployees, ...employeeIds])]
        }
    }

    function toggleEmployeeSelection(employeeId: number) {
        if (selectedEmployees.includes(employeeId)) {
            selectedEmployees = selectedEmployees.filter(id => id !== employeeId)
        } else {
            selectedEmployees = [...selectedEmployees, employeeId]
        }
    }

    onMount(async () => { getDepartments() })
</script>

<div class="flex flex-col gap-y-2">
    <div class="flex flex-col">
        <span class="font-semibold text-base text-black">{$LL.CreateReviews.SelectEmployees()}</span>
        <span class="text-xs text-gray-400">{$LL.CreateReviews.SelectEmployeesText()}</span>
    </div>

    <div>
        <button class="cursor-pointer p-2 relative rounded text-black hover:bg-gray-100">
            <div class="absolute left-8 px-1 rounded text-xs top-0 bg-blue-500 text-white">
                {selectedEmployees.length >= 100 ? '+99': `${selectedEmployees.length}`}
            </div>
            <svelte:component this={UsersIcon} size={40} />
        </button>
    </div>

    <div class="flex gap-x-5 w-full">
        <div class="flex flex-col gap-y-1 w-full">
            {#each departments as department}
                <button on:click={() => department.isOpen = !department.isOpen} class="flex gap-x-2 items-center p-2 rounded text-sm text-black hover:bg-gray-100">
                    <svelte:component this={department.isOpen ? ChevronUpIcon : ChevronDownIcon} size={16} />
                    <input bind:group={selectedDepartments} on:click|stopPropagation class="pointer-events-auto w-4 h-4" type="checkbox" value={department.departmentId} />
                    <svelte:component this={FolderIcon} size={16} />
                    <span>{department.departmentDescription}</span>
                </button>
                {#if department.isOpen}
                    <div class="flex flex-col gap-y-1 ml-5">
                        {#await getEmployeesFromDepartment(department.departmentId)}
                            <span class="ml-3">Loading...</span>
                        {:then}
                            {#if department.employees.length == 0}
                                <span class="ml-3">No employees to show.</span>
                            {:else}
                                <button on:click={() => selectAllEmployees(department)} class="ml-3 hover:underline mr-auto">Select All</button>
                                {#each department.employees as employee}
                                    <label class="flex gap-x-2 items-center p-2 rounded text-sm  text-black hover:bg-gray-100">
                                        <svelte:component this={MinusIcon} size={16} />
                                        <input
                                            on:change={() => toggleEmployeeSelection(employee.employeeId)}
                                            checked={selectedEmployees.includes(employee.employeeId)} 
                                            class="w-4 h-4" 
                                            type="checkbox" 
                                            value={employee.employeeId}
                                        />
                                        <svelte:component this={UserIcon} size={16} />
                                        <span>{employee.employeeName}</span>
                                    </label>
                                {/each}
                            {/if}
                        {/await}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>