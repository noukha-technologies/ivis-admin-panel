export const queryKeys = {
  anprCaptures: {
    all: ['anpr-captures'] as const,
    list: (page: number, search: string) =>
      [...queryKeys.anprCaptures.all, 'list', { page, search }] as const,
  },
  ropVerifications: {
    all: ['rop-verifications'] as const,
    list: (page: number, search: string) =>
      [...queryKeys.ropVerifications.all, 'list', { page, search }] as const,
  },
};
