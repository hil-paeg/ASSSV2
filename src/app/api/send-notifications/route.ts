import { type NextRequest, NextResponse } from "next/server"
import { sendTicketNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientName, ticketIssue, actionDone, ticketId } = body

    await sendTicketNotification({
      clientName,
      ticketIssue,
      ticketId,
    })

    return NextResponse.json({ success: true, message: "Email notification sent successfully" })
  } catch (error) {
    console.error("Error sending email notification:", error)
    return NextResponse.json({ error: "Failed to send email notification" }, { status: 500 })
  }
}
