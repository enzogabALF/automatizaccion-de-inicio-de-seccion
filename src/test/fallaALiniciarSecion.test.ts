import { chromium } from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config({ path: './src/progress.env' });

describe('Inicio de sesión fallido', () => {
  it('Debería mostrar un mensaje de error al fallar el inicio de sesión', async () => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORK; // Introducimos una contraseña incorrecta

    const browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(
        'https://sistemacuenca.ucp.edu.ar/alumnosnotas/Default.aspx?ReturnUrl=%2falumnosnotas%2fProteccion%2fInscripcionesExamenes.aspx%3fSel%3d2&Sel=2'
      );

      await page.fill('input[name="ctl00$ContentPlaceHolder1$TextBox1"]', username);
      await page.fill('input[name="ctl00$ContentPlaceHolder1$Clave"]', password);
      await page.click('input[id="ctl00_ContentPlaceHolder1_ImageButton1"]');

      const errorMessageElement = await page.waitForSelector(
        '#ctl00_ContentPlaceHolder1_Label2',
        { timeout: 50000 }
      );
      const errorMessage = await errorMessageElement?.textContent();

      expect(errorMessage).toContain('La combinación  de usuario y clave no coincide');
    } finally {
      await browser.close();
    }
  }, 60000); // Tiempo máximo para la prueba (60 segundos)
});
