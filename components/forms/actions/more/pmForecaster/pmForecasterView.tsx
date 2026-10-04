import PmForecasterForm from "./pmForecasterForm";

type PMForecasterViewProps = {
  formId?: string;
  hideSubmitButton?: boolean;
};

export default function PMForecasterView({
  formId = "pm-forecaster-form",
  hideSubmitButton,
}: PMForecasterViewProps = {}) {
  return (
    <PmForecasterForm formId={formId} hideSubmitButton={hideSubmitButton} />
  );
}
