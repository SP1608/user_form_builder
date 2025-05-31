import { create } from 'zustand';

const FORM_DATA_STORAGE_KEY = 'internship_form_data';

const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  prevInternExperience: '',
  internshipDuration: '',
  aboutYourself: '',
};

const loadInitialFormData = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(FORM_DATA_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultFormData;
      }
    }
  }
  return defaultFormData;
};

const useFormStore = create((set, get) => ({
  formData: loadInitialFormData(),
  errors: {},
  setFormData: (data) => {
    const updatedData = { ...get().formData, ...data };
    set({ formData: updatedData });
    if (typeof window !== 'undefined') {
      localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(updatedData));
    }
  },
  setErrors: (errors) => set({ errors }),
  clearErrors: () => set({ errors: {} }),
  clearFormData: () => {
    set({ formData: defaultFormData, errors: {} });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FORM_DATA_STORAGE_KEY);
      localStorage.removeItem('currentStep');
    }
  },
}));

export default useFormStore;
