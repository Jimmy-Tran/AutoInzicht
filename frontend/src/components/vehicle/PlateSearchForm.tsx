import { useState, type SubmitEvent } from "react";
import "../../styles/PlateSearchForm.css";

export default function PlateSearchForm() {
  const [plate, setPlate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedPlate = plate
      .toUpperCase()
      .replace(/[\s-]/g, "");

    if (!/^[A-Z0-9]{6}$/.test(normalizedPlate)) {
      setError("Vul een kenteken van 6 letters en cijfers in.");
      return;
    }

    setError("");
    window.location.assign(`/vehicle/${normalizedPlate}`);
  }

  return (
    <form className="plate-search" onSubmit={handleSubmit}>
      <label className="plate-search__label" htmlFor="license-plate">
        Vul je kenteken in
      </label>

      <div className="plate-search__plate">
        <span className="plate-search__country" aria-hidden="true">
          <span>EU</span>
          <strong>NL</strong>
        </span>

        <input
          id="license-plate"
          className="plate-search__input"
          name="plate"
          type="text"
          value={plate}
          onChange={(event) => {
            setPlate(event.target.value.toUpperCase());
            setError("");
          }}
          placeholder="XX-XXX-X"
          maxLength={8}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? "plate-error plate-hint" : "plate-hint"
          }
        />
      </div>

      {error && (
        <p id="plate-error" className="plate-search__error" role="alert">
          {error}
        </p>
      )}

      <button className="plate-search__button" type="submit">
        Check kenteken
        <span aria-hidden="true">→</span>
      </button>

      <p id="plate-hint" className="plate-search__hint">
        Voertuiggegevens, gebruikskosten en aankoopadvies op één plek.
      </p>
    </form>
  );
}