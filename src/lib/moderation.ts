import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

// Matches English profanity including common evasions (leetspeak, spacing,
// repeated characters). Used by both the submit form and the API route.
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export function isNameAppropriate(name: string): boolean {
  // Also check with separators stripped, so "f u c k" / "f.u.c.k" can't slip through
  const collapsed = name.replace(/[^a-zA-Z0-9]+/g, "");
  return !matcher.hasMatch(name) && !matcher.hasMatch(collapsed);
}

export const NAME_REJECTED_MESSAGE = "That name isn't allowed — please pick another.";
