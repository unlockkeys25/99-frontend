"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Sample contacts data
const sampleContacts = [
  { id: "c1", name: "Jordan Smith", contact: "jordan@example.com" },
  { id: "c2", name: "Alex Wong", contact: "+1 (555) 123-4567" },
  { id: "c3", name: "Taylor Reed", contact: "taylor@example.com" },
  { id: "c4", name: "Morgan Chen", contact: "+1 (555) 987-6543" },
  { id: "c5", name: "Casey Johnson", contact: "casey@example.com" },
  { id: "c6", name: "Riley Garcia", contact: "+1 (555) 456-7890" },
]

interface ImportContactsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportContacts: (contacts: Array<{ name: string }>) => void
}

export function ImportContactsModal({ open, onOpenChange, onImportContacts }: ImportContactsModalProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = sampleContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.contact.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleContact = (contactId: string) => {
    setSelectedContacts((current) =>
      current.includes(contactId) ? current.filter((id) => id !== contactId) : [...current, contactId],
    )
  }

  const toggleAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map((contact) => contact.id))
    }
  }

  const handleImport = () => {
    if (selectedContacts.length === 0) {
      toast({
        description: "Please select at least one contact",
        variant: "destructive",
        duration: 2000,
      })
      return
    }

    const contactsToImport = sampleContacts
      .filter((contact) => selectedContacts.includes(contact.id))
      .map((contact) => ({ name: contact.name }))

    onImportContacts(contactsToImport)
    onOpenChange(false)
    setSelectedContacts([])

    toast({
      description: `${selectedContacts.length} contact${selectedContacts.length > 1 ? "s" : ""} imported`,
      duration: 2000,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Import from Contacts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts"
              className="pl-9 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                onCheckedChange={toggleAll}
              />
              <Label htmlFor="select-all" className="text-sm text-sage-700">
                Select All
              </Label>
            </div>
            <span className="text-xs text-sage-500">{selectedContacts.length} selected</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white hover:bg-sage-50 transition-colors"
                >
                  <Checkbox
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => toggleContact(contact.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={`contact-${contact.id}`} className="font-medium text-sage-800 block cursor-pointer">
                      {contact.name}
                    </Label>
                    <p className="text-xs text-sage-500 truncate">{contact.contact}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sage-500">No contacts found</div>
            )}
          </div>

          <p className="text-xs text-sage-500 italic text-center">Your contacts remain private and are never shared.</p>

          <Button
            type="button"
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleImport}
            disabled={selectedContacts.length === 0}
          >
            Add Selected Friends
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
