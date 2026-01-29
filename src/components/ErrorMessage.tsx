import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="clinical-card p-6 border-destructive/50">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-destructive/10">
          <AlertCircle className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-destructive mb-1">Erro na Consulta</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
