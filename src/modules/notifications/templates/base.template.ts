export interface BaseEmailTemplateParams {
  content: string;
  header?: string;
  footer?: string;
  headerText?: string;
}

export const getBaseEmailTemplate = (params: BaseEmailTemplateParams) => {
  const { content, header, footer, headerText } = params;
  const defaultHeader = `
    <div style="background-color: #000000ff; padding: 10px; text-align: center;">
      <img src="https://myalternates.com/Content/images/200x500.jpg" alt="MyAlternates Logo" style="max-width: 250px; height: auto;">
    </div>
    `;
  const defaultFooter = `
    <div style="padding: 10px; margin: 10px auto; text-align: center; font-size: 12px; color: #020202ff;">
      <p>&copy; ${new Date().getFullYear()} MyAlternates. All rights reserved.</p>
      <p>MyAlternates, India</p>
      <p><a href="#" style="color: #007bff;">Privacy Policy</a> | <a href="#" style="color: #007bff;"> Terms & Conditions </a></p>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .outer-container { background-color: #f4f4f4; padding: 20px; }
            .email-container { max-width: 600px; margin: 20px auto; background-color:#ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .content {background-color: #ffffff; padding: 40px; }
            h1, h2, h3 { color: #333; }
            p { margin-bottom: 10px; }
            .button { display: inline-block; padding: 10px 20px; margin-top: 15px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
            a { color: #007bff; text-decoration: none; }
        </style>
    </head>
    <body>
      <div class="outer-container">
        <div class="email-container">
          ${header || defaultHeader}
          <div class="content">
              ${headerText ? headerText : ""}
              ${content}
          </div>
        </div>
        ${footer || defaultFooter}
      </div>
    </body>
    </html>
  `;
};