import { useState } from 'react';
import { Shield, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultiSelectChips } from '@/components/MultiSelectChips';
import { AutocompleteSelect } from '@/components/AutocompleteSelect';
import { AnalysisResult } from '@/components/AnalysisResult';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { checkDrugSafety } from '@/lib/api';
import { DrugSafetyResponse, ApiError } from '@/types/drug-safety';
import { SPECIAL_POPULATIONS, RISK_CONDITIONS, COMMON_MEDICATIONS } from '@/data/options';

export default function Index() {
  const [specialPopulations, setSpecialPopulations] = useState<string[]>([]);
  const [riskConditions, setRiskConditions] = useState<string[]>([]);
  const [currentMedications, setCurrentMedications] = useState<string[]>([]);
  const [prescriptionMedication, setPrescriptionMedication] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DrugSafetyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!prescriptionMedication.trim()) {
      setError('Por favor, selecione o medicamento a prescrever.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await checkDrugSafety({
        specialPopulations,
        riskConditions,
        currentMedications,
        prescriptionMedication: prescriptionMedication.trim(),
      });
      setResult(response);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Erro desconhecido ao consultar a API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Drug Safety Check</h1>
              <p className="text-sm text-muted-foreground">
                Análise de interação medicamentosa, populações especiais e condições de risco
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Dados do Paciente */}
        <section className="clinical-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Dados do Paciente</h2>
          <div className="space-y-6">
            <MultiSelectChips
              label="Populações Especiais"
              placeholder="Selecione as populações especiais..."
              options={SPECIAL_POPULATIONS}
              selectedValues={specialPopulations}
              onChange={setSpecialPopulations}
            />

            <MultiSelectChips
              label="Condições de Risco"
              placeholder="Busque e selecione condições..."
              options={RISK_CONDITIONS}
              selectedValues={riskConditions}
              onChange={setRiskConditions}
              searchable
            />

            <MultiSelectChips
              label="Medicamentos em Uso"
              placeholder="Digite ou selecione medicamentos..."
              options={COMMON_MEDICATIONS}
              selectedValues={currentMedications}
              onChange={setCurrentMedications}
              allowCustom
              searchable
            />
          </div>
        </section>

        {/* Prescrição */}
        <section className="clinical-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Prescrição</h2>
          <AutocompleteSelect
            label="Medicamento a Prescrever"
            placeholder="Digite o nome do medicamento..."
            options={COMMON_MEDICATIONS}
            value={prescriptionMedication}
            onChange={setPrescriptionMedication}
            allowCustom
          />
        </section>

        {/* Botão de Análise */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          size="lg"
          className="w-full h-12 text-base font-semibold"
        >
          <Search className="w-5 h-5 mr-2" />
          Analisar Interações
        </Button>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {/* Result */}
        {result && !isLoading && <AnalysisResult result={result} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center">
            Este sistema é uma ferramenta de apoio à decisão clínica. 
            Sempre consulte fontes oficiais e utilize seu julgamento profissional.
          </p>
        </div>
      </footer>
    </div>
  );
}
