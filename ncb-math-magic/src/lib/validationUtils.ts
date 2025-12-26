import React from "react";

// Define your regular expressions
export const numberRegex = /[^0-9]/g;
export const alphabetRegex = /[^a-zA-Z ]/g;
export const alphaNumericRegex = /[^a-zA-Z0-9 ]/g;
export const pinRegex = /[^0-9]/g;

/**
 * A generic input handler function that filters input based on a provided regular expression.
 *
 * @param event - The change event triggered by the input field.
 * @param regex - The regular expression to use for filtering the input.
 * @param setter - A function to update the state with the filtered input.
 *
 * @returns The filtered input value.
 */
export const handleInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  regex: RegExp,
  setter?: (value: string) => void
) => {
  const result = event.target.value.replace(regex, "");
  if (setter) setter(result);
  return result;
};

// Example usage

// export const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) =>
//     handleInputChange(event, numberRegex, anyState);
