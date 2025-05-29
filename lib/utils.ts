import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Theme {
  brandColor: string
  buttonText: string
}

export function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")
  const brandName = "Homeo South" // Hardcoded brand name

  // Use brand color for Homeo South
  const brandColor = "#139A43" // Green color from your brand
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
    headingColor: brandColor,
  }

  return `
  <body style="background: ${
    color.background
  }; font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden; margin-top: 20px;">
            <!-- Header -->
            <tr>
              <td align="center" bgcolor="${brandColor}" style="padding: 20px 0;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0;">${brandName}</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td bgcolor="#ffffff" style="padding: 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="color: #153643; font-size: 18px; padding-bottom: 20px;">
                      <h2 style="color: ${
                        color.headingColor
                      }; margin: 0;">Sign in to your account</h2>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #153643; font-size: 16px; line-height: 24px;">
                      <p>We received a request to sign in to ${brandName} using this email address. Click the button below to sign in.</p>
                      <p>This link will expire in 10 minutes and can only be used once.</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="${
                            color.buttonBackground
                          }" style="border-radius: 50px;">
                            <a href="${url}" target="_self"
                              style="padding: 12px 30px; border-radius: 50px; color: ${
                                color.buttonText
                              }; display: inline-block; font-size: 16px; font-weight: bold; text-decoration: none;">Sign In Now</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 0 10px 0; color: #666; font-size: 14px; line-height: 21px;">
                      <p>If you didn't request this email, you can safely ignore it.</p>
                      <p>For security, this request was received from a ${host} website.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td bgcolor="#f4f4f4" style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
export function text({ url, host }: { url: string; host: string }) {
  return `Sign in to Homeo South

We received a request to sign in to Homeo South using this email address.
Use the link below to sign in:

${url}

This link will expire in 10 minutes and can only be used once.

If you didn't request this email, you can safely ignore it.
For security, this request was received from a ${host} website.

© ${new Date().getFullYear()} Homeo South. All rights reserved.
`
}
