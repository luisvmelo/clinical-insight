import { DrugSafetyResponse } from '@/types/drug-safety';
import { Shield, AlertTriangle, XOctagon, AlertCircle, Pill, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisResultProps {
  result: DrugSafetyResponse;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const statusConfig = {
    LIBERADO: {
      icon: Shield,
      label: 'Liberado',
      className: 'status-safe',
    },
    PRECAUCAO: {
      icon: AlertTriangle,
      label: 'Precaução',
      className: 'status-caution',
    },
    BLOQUEADO: {
      icon: XOctagon,
      label: 'Bloqueado',
      className: 'status-blocked',
    },
  };

  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  const getSeverityColor = (severity: string) => {
    const lower = severity.toLowerCase();
    if (lower.includes('alta') || lower.includes('high') || lower.includes('grave')) {
      return 'text-severity-high';
    }
    if (lower.includes('moderada') || lower.includes('moderate') || lower.includes('média')) {
      return 'text-severity-moderate';
    }
    return 'text-severity-low';
  };

  return (
    <div className="space-y-6">
      {/* Status Principal */}
      <div className="clinical-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Resultado da Análise</h3>
          <div className={cn('status-badge', config.className)}>
            <StatusIcon className="w-4 h-4" />
            {config.label}
          </div>
        </div>
      </div>

      {/* Alertas de População */}
      {result.populationAlerts && result.populationAlerts.length > 0 && (
        <div className="clinical-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-status-caution" />
            <h4 className="font-semibold text-foreground">Alertas de População</h4>
          </div>
          <ul className="space-y-2">
            {result.populationAlerts.map((alert, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-card-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-status-caution mt-2 flex-shrink-0" />
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alertas de Condições Clínicas */}
      {result.clinicalConditionAlerts && result.clinicalConditionAlerts.length > 0 && (
        <div className="clinical-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-status-caution" />
            <h4 className="font-semibold text-foreground">Alertas de Condições Clínicas</h4>
          </div>
          <ul className="space-y-2">
            {result.clinicalConditionAlerts.map((alert, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-card-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-status-caution mt-2 flex-shrink-0" />
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interações Medicamentosas */}
      {result.drugInteractions && result.drugInteractions.length > 0 && (
        <div className="clinical-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Interações Medicamentosas</h4>
          </div>
          <div className="space-y-4">
            {result.drugInteractions.map((interaction, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{interaction.medication}</span>
                  <span className={cn('text-sm font-medium', getSeverityColor(interaction.severity))}>
                    {interaction.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendação Final */}
      {result.finalRecommendation && (
        <div className="clinical-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Recomendação Final</h4>
          </div>
          <p className="text-sm text-card-foreground leading-relaxed">
            {result.finalRecommendation}
          </p>
        </div>
      )}
    </div>
  );
}
