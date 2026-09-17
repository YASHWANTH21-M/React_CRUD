import { expect, test } from '@playwright/test'

const employeeSeed = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phoneNumber: '9876543210',
    department: 'Engineering',
    jobTitle: 'Frontend Developer',
    salary: 60000,
    joiningDate: '2025-01-15',
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    phoneNumber: '9123456789',
    department: 'Sales',
    jobTitle: 'Account Manager',
    salary: 50000,
    joiningDate: '2024-06-01',
  },
]

test.describe('Employee Management E2E', () => {
  test('login, add, edit, delete employee flow', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'demo-token', role: 'ADMIN', message: 'Login successful' }),
      })
    })

    await page.route('**/api/v1/employees', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(employeeSeed),
        })
        return
      }

      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 3, ...body }),
        })
        return
      }

      await route.continue()
    })

    await page.route('**/api/v1/employees/*', async (route) => {
      if (route.request().method() === 'PUT') {
        const body = route.request().postDataJSON()
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, ...body }),
        })
        return
      }

      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        })
        return
      }

      await route.continue()
    })

    await page.goto('/')

    await page.getByLabel('Username').fill('admin')
    await page.getByLabel('Password').fill('123456')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('TEAM SNAPSHOT')).toBeVisible()

    const dialog = page.getByRole('dialog')

    await page.getByRole('button', { name: 'Add employee' }).click()
    await dialog.getByLabel('First name').fill('Charlie')
    await dialog.getByLabel('Last name').fill('Brown')
    await dialog.getByLabel('Email').fill('charlie.brown@example.com')
    await dialog.getByLabel('Phone number').fill('9988776655')
    await dialog.getByLabel('Department').click()
    await dialog.getByRole('option', { name: 'Engineering' }).click()
    await dialog.getByLabel('Job title').fill('QA Engineer')
    await dialog.getByLabel('Annual salary').fill('65000')
    await dialog.getByLabel('Joining date').fill('2025-02-10')
    await dialog.getByRole('button', { name: 'Add employee' }).click()

    await expect(page.getByText('Charlie Brown')).toBeVisible()

    const row = page.locator('tr', { hasText: 'Charlie Brown' })
    await row.getByRole('button').first().click()

    const editDialog = page.getByRole('dialog')
    await editDialog.getByLabel('First name').fill('Charlie Updated')
    await editDialog.getByLabel('Email').fill('charlie.updated@example.com')
    await editDialog.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Charlie Updated Brown')).toBeVisible()

    const updatedRow = page.locator('tr', { hasText: 'Charlie Updated Brown' })
    await updatedRow.getByRole('button').nth(1).click()
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByText('Charlie Updated Brown')).not.toBeVisible()
  })
})
