import { test, expect } from '@playwright/test';

test('Top-Down STUB: Login REAL -> Inventory STUB', async ({ page }) => {

  // =====================================================
  // REAL A : Login จริง
  // =====================================================

  await page.goto('/');

  await page.locator('#user-name')
    .fill('standard_user');

  await page.locator('#password')
    .fill('secret_sauce');

  // รอ navigation หลังจาก login
  await Promise.all([
    page.waitForURL(/inventory\.html/),
    page.locator('#login-button').click(),
  ]);

  console.log('Current URL:', page.url());


  // =====================================================
  // STUB B : Inventory + Shopping Card
  // =====================================================

  await page.setContent(`
    <!doctype html>

    <html>
      <head>
        <meta charset="utf-8">
        <title>Stub Inventory</title>
      </head>

      <body>

        <h1>Stub Inventory</h1>

        <!-- Shopping Card Stub -->
        <div
          class="inventory_item"
          data-test="shopping-card"
        >

          <h2 class="inventory_item_name">
            Shopping Card
          </h2>

          <p class="inventory_item_desc">
            Fake Shopping Card from Stub B
          </p>

          <!-- ชื่อและนามสกุลของนักศึกษา -->
          <p class="student-name" data-test="student-name">
            นนทิวัฒน์ ตะตานัง
          </p>

          <button
            class="btn_inventory"
            data-test="add-to-cart"
          >
            Add to cart
          </button>

        </div>

      </body>
    </html>
  `);


  // =====================================================
  // Assert : ตรวจสอบว่า Shopping Card มีอยู่
  // =====================================================

  await expect(
    page.locator('[data-test="shopping-card"]')
  ).toBeVisible();


  // =====================================================
  // Assert : ตรวจสอบชื่อและนามสกุล
  // =====================================================

  await expect(
    page.locator('[data-test="student-name"]')
  ).toContainText('นนทิวัฒน์ ตะตานัง');

});