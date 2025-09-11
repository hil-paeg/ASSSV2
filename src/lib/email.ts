import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendTicketNotification({
  clientName,
  ticketIssue,
  action,
  ticketNumber,
}: {
  clientName: string
  ticketIssue: string
  action: "creation" | "update status" | "closed"
  ticketNumber: string
}) {
  try {
    await transporter.sendMail({
      from: `"Support System" <${process.env.EMAIL_USER}>`,
      to: "vedupadhye10@gmail.com",
      subject: `Ticket ${action.toUpperCase()}: ${ticketIssue}`,
      html: `
        <h3>Ticket ${action.charAt(0).toUpperCase() + action.slice(1)} Notification</h3>
        <p>A ticket has been ${action === "creation" ? "created" : action === "update status" ? "updated" : "closed"} with the following details:</p>
        <ul>
          <li><strong>Ticket Number:</strong> ${ticketNumber}</li>
          <li><strong>Client Name:</strong> ${clientName}</li>
          <li><strong>Ticket Issue:</strong> ${ticketIssue}</li>
          <li><strong>Action Done:</strong> ${action}</li>
        </ul>
        <p>Please review the ticket in the support system.</p>
      `,
    })
    console.log(`Email sent successfully for ticket ${action}`)
  } catch (error: any) {
    console.error("Error sending email:", error.message)
  }
}
