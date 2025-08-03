import { Form } from "react-router";

interface ResetButtonProps {
  className?: string;
}

export function ResetButton({ className = "" }: ResetButtonProps) {
  return (
    <Form method="post" action="/api/tasks" className={className}>
      <input type="hidden" name="action" value="reset" />
      <button
        type="submit"
        className="px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 active:scale-95 bg-gray-200 hover:bg-gray-300 text-gray-800 text-red-600 hover:bg-red-50"
        onClick={(e) => {
          if (
            !confirm("¿Estás seguro de que quieres resetear todos los datos?")
          ) {
            e.preventDefault();
          }
        }}
      >
        🗑️ Resetear Datos
      </button>
    </Form>
  );
}
