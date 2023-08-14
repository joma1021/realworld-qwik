import { component$ } from "@builder.io/qwik";

interface FormErrorProps {
  errors: { [key: string]: string[] };
}

export default component$((props: FormErrorProps) => {
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
