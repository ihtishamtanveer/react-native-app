export const setLoading = (isLoading: boolean) => ({
  type: "SET_LOADING" as const,
  payload: isLoading,
});

export type LoadingAction = ReturnType<typeof setLoading>;
