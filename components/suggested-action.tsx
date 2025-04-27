import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SuggestedActionProps {
  message: string
  actionLabel: string
  person?: string
}

export function SuggestedAction({ message, actionLabel, person }: SuggestedActionProps) {
  return (
    <Card className="border-none shadow-sm bg-secondary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {person && (
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={person} />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {person.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex-1">
            <p className="text-sage-800 mb-3">{message}</p>

            <div className="flex justify-end">
              <Button variant="outline" className="rounded-full text-sm bg-white hover:bg-sage-50">
                {actionLabel}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
