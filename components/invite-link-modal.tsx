"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface InviteLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteLinkModal({ open, onOpenChange }: InviteLinkModalProps) {
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const inviteLink = "https://99.app/invite/abc123"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)

    toast({
      description: "Invite link copied to clipboard",
      duration: 2000,
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Invite via Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-link" className="text-sage-700">
              Invite Link
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="invite-link"
                value={inviteLink}
                readOnly
                className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary"
              />
              <Button type="button" size="icon" onClick={copyToClipboard} className="rounded-full">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal-message" className="text-sage-700">
              Personal Message (Optional)
            </Label>
            <Textarea
              id="personal-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal note to your invitation..."
              className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary resize-none min-h-[100px]"
            />
          </div>

          <p className="text-xs text-sage-500 italic">Send this link to invite someone to join 99.</p>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (message) {
                  navigator.clipboard.writeText(`${inviteLink}\n\n${message}`)
                  toast({
                    description: "Invite with message copied to clipboard",
                    duration: 2000,
                  })
                } else {
                  copyToClipboard()
                }
                onOpenChange(false)
              }}
            >
              Share Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
