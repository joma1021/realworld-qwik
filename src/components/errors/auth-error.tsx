import { component$ } from "@builder.io/qwik";

interface AuthErrorProps {
  errors: { [key: string]: string[] };
}

export default component$((props: AuthErrorProps) => {
  return (
    <ul class="error-messages">
      {Object.entries(props.errors).map(([field, fieldErrors]) =>
        fieldErrors.map((fieldError) => (
          <li key={field + fieldError}>
            {field} {fieldError}
          </li>
        ))
      )}
    </ul>
  );
});
