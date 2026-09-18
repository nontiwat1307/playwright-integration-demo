import {
  test,
  expect,
  BrowserContext,
  Page,
} from '@playwright/test';

// =====================================================
// DRIVER A
// ทำหน้าที่เรียก Shopping Cart
// ไม่กรอก username/password ผ่านหน้า Login
// =====================================================

async function driverOpenShoppingCart(
  context: BrowserContext
): Promise<Page> {

  // จำลอง Login ด้วย Cookie
  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);

  // เปิดหน้าใหม่
  const page = await context.newPage();

  // เปิด Inventory
  await page.goto(
    'https://www.saucedemo.com/inventory.html'
  );

  // ตรวจสอบว่า Inventory แสดงผล
  await expect(
    page.locator('.inventory_list')
  ).toBeVisible();

  // ===================================================
  // เพิ่มสินค้าเข้า Shopping Cart
  // ===================================================

  await page
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();

  // ตรวจสอบว่ามีสินค้าใน Cart จำนวน 1 ชิ้น
  await expect(
    page.locator('.shopping_cart_badge')
  ).toHaveText('1');

  // ===================================================
  // เรียก Shopping Cart
  // ===================================================

  await page
    .locator('.shopping_cart_link')
    .click();

  // ตรวจสอบว่าเข้าสู่หน้า Cart
  await expect(page).toHaveURL(
    /cart\.html/
  );

  // ตรวจสอบว่า Shopping Cart แสดงผล
  await expect(
    page.locator('.cart_list')
  ).toBeVisible();

  return page;
}


// =====================================================
// TEST
// Bottom-Up DRIVER
// Driver A -> B Inventory -> E Add Cart -> Shopping Cart
// =====================================================

test(
  'Bottom-Up DRIVER: Driver A -> Inventory -> Add Cart -> Shopping Cart',
  async ({ browser }) => {

    const context = await browser.newContext();

    try {

      // =================================================
      // DRIVER A เรียก Shopping Cart
      // =================================================

      const page = await driverOpenShoppingCart(context);

      // =================================================
      // B = Inventory
      // =================================================

      // ตรวจสอบว่าสินค้าที่เลือกคือ Sauce Labs Backpack
      await expect(
        page.locator('.inventory_item_name')
      ).toHaveText('Sauce Labs Backpack');

      // =================================================
      // Shopping Cart
      // =================================================

      await expect(
        page.locator('.cart_item')
      ).toHaveCount(1);

      // ตรวจสอบชื่อสินค้าใน Shopping Cart
      await expect(
        page.locator('.inventory_item_name')
      ).toContainText('Sauce Labs Backpack');

    } finally {

      // ปิด Context
      await context.close();

    }
  }
);