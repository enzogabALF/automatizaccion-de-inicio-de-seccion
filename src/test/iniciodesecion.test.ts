import { chromium } from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config({ path: './src/progress.env' });

describe('Inicio de sesión exitoso', () => {
  it('Debería mostrar el usuario después de un inicio de sesión exitoso', async () => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !password) {
      throw new Error('Las credenciales no están definidas en el archivo .env');
    }

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

      const spanElement = await page.waitForSelector('#ctl00_Label1', { timeout: 50000 });
      const textContent = await spanElement?.textContent();

      expect(textContent).toContain('Alfonso, Enzo Gabriel - Ingeniería en Sistemas de Información');
    } finally {
      await browser.close();
    }
  }, 60000); // Tiempo máximo para la prueba (60 segundos)
});
