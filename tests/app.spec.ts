import { expect, test } from '@playwright/test'

const employees = [
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

test.describe('Employee Management App', () => {
  test('user can register and access the employee dashboard', async ({ page }) => {
    await page.route('**/api/v1/auth/register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'demo-token', role: 'ADMIN', message: 'Registration successful' }),
      })
    })

    await page.route('**/api/v1/employees', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(employees),
      })
    })

    await page.goto('/')

    await page.getByRole('button', { name: 'Register' }).click()
    await page.getByLabel('Username').fill('newadmin')
    await page.getByLabel('Password').fill('Pass123!')
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'ADMIN' }).click()
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('TEAM SNAPSHOT')).toBeVisible()
    await expect(page.getByText('Alice Johnson')).toBeVisible()
    await expect(page.getByText('Total employees')).toBeVisible()
  })

  test('user can login and search employees in the dashboard', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'demo-token', role: 'USER', message: 'Login successful' }),
      })
    })

    await page.route('**/api/v1/employees', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(employees),
      })
    })

    await page.goto('/')

    await page.getByLabel('Username').fill('admin')
    await page.getByLabel('Password').fill('123456')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('TEAM SNAPSHOT')).toBeVisible()
    await page.getByPlaceholder(/search/i).fill('Alice')
    await expect(page.getByText('Alice Johnson')).toBeVisible()
    await expect(page.getByText('Bob Smith')).not.toBeVisible()
  })
})
