import { useGetProgramAccountQuery } from '@/features/t3flip/data-access/use-get-program-account-query'
import { AppAlert } from '@/components/app-alert'
import { useSolana } from '@/components/solana/use-solana'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Code, Database } from 'lucide-react'

export function T3flipUiProgram() {
  const { cluster } = useSolana()
  const query = useGetProgramAccountQuery()

  if (query.isLoading) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/80 border-2 shadow-xl">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading program data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (!query.data?.value) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/80 border-2 border-destructive/50 shadow-xl">
        <CardContent className="p-8">
          <AppAlert>
            Program account not found on <Badge variant="secondary">{cluster.label}</Badge>. 
            Be sure to deploy your program and try again.
          </AppAlert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-card/80 border-2 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">Program Account Data</CardTitle>
              <CardDescription className="mt-1">
                Current state of the T3Flip program account
              </CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Database className="w-3 h-3" />
              {cluster.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg bg-muted/30 border p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
              {JSON.stringify(query.data.value.data, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
