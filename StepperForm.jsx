import React, { useState, useEffect } from "react";
import useFormStore from "../hooks/useFormStore";
import Step from "./Step";

const steps = [
  { label: "Personal Information" },
  { label: "Internship Details" },
  { label: "About Yourself" },
];

const SUBMITTED_DATA_KEY = "submitted_form_data";
const FORM_DATA_STORAGE_KEY = "internship_form_data";
const THEME_STORAGE_KEY = "internship_form_theme";

const StepperForm = () => {
  const {
    formData,
    setFormData,
    clearFormData,
    setErrors,
    errors,
    clearErrors,
  } = useFormStore();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [theme, setTheme] = useState("light");
  const [newField, setNewField] = useState("");
  const [helpText, setHelpText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState("desktop"); // view state: mobile, laptop, desktop

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

    const savedStep = localStorage.getItem("currentStep");
    const savedFormData = localStorage.getItem(FORM_DATA_STORAGE_KEY);
    const submittedFromStorage = localStorage.getItem(SUBMITTED_DATA_KEY);

    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        if (!parsed.fields) parsed.fields = [];
        setFormData(parsed);
      } catch {}
    }

    if (savedStep) {
      const numStep = parseInt(savedStep, 10);
      if (!isNaN(numStep) && numStep >= 0 && numStep < steps.length) {
        setCurrentStep(numStep);
      }
    }

    if (submittedFromStorage) {
      try {
        const parsedSubmitted = JSON.parse(submittedFromStorage);
        setSubmittedData(parsedSubmitted);
        setSubmitted(true);
      } catch {}
    }

    setDataLoaded(true);
  }, [setFormData]);

  useEffect(() => {
    if (dataLoaded && !submitted) {
      localStorage.setItem("currentStep", currentStep.toString());
      localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [currentStep, formData, submitted, dataLoaded]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleNext = () => {
    if (validateFields()) {
      clearErrors();
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.firstName?.trim())
        newErrors.firstName = "First Name is required";
      if (!formData.lastName?.trim())
        newErrors.lastName = "Last Name is required";
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone Number is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone Number must be 10 digits";
      }
    } else if (currentStep === 1) {
      if (!formData.prevInternExperience?.trim())
        newErrors.prevInternExperience = "Previous Experience is required";
      if (!formData.internshipDuration?.trim())
        newErrors.internshipDuration = "Internship Duration is required";
    } else if (currentStep === 2) {
      if (!formData.aboutYourself?.trim())
        newErrors.aboutYourself = "About Yourself is required";
    }

    if (formData.fields && formData.fields.length > 0) {
      formData.fields.forEach((field, index) => {
        if (!field.value?.trim()) {
          newErrors[`dynamicField${index}`] =
            field.errorMessage || "This field is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClear = () => {
    clearFormData();
    setCurrentStep(0);
    setSubmitted(false);
    setSubmittedData(null);
    localStorage.removeItem(SUBMITTED_DATA_KEY);
    localStorage.removeItem(FORM_DATA_STORAGE_KEY);
    localStorage.removeItem("currentStep");
  };

  const handleAddField = () => {
    if (newField.trim() && helpText.trim() && errorMessage.trim()) {
      const newFieldObj = {
        label: newField,
        value: "",
        type: "text",
        helpText,
        errorMessage,
      };

      const updatedFields = [...(formData.fields || []), newFieldObj];
      const updatedFormData = { ...formData, fields: updatedFields };

      setFormData(updatedFormData);
      localStorage.setItem(
        FORM_DATA_STORAGE_KEY,
        JSON.stringify(updatedFormData)
      );

      setNewField("");
      setHelpText("");
      setErrorMessage("");
    }
  };

  const generateFormId = () => {
    return Math.floor(Math.random() * 10000000000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const formId = generateFormId();

    const submittedFormData = {
      ...formData,
      formId,
      shareableUrl: `http://yourdomain.com/form/${formId}`,
    };

    localStorage.setItem(
      `submitted_form_data_${formId}`,
      JSON.stringify(submittedFormData)
    );
    localStorage.setItem(SUBMITTED_DATA_KEY, JSON.stringify(submittedFormData));

    setSubmittedData(submittedFormData);
    setSubmitted(true);
    clearFormData();
    setCurrentStep(0);
    localStorage.removeItem(FORM_DATA_STORAGE_KEY);
    localStorage.removeItem("currentStep");
  };

  return (
    <div
      className={`overflow-auto min-h-screen w-screen flex flex-col items-center justify-start py-6 px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold mb-4 sm:mb-0">Internship Survey</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setView("desktop")}
            className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
          >
            Desktop View
          </button>
          <button
            onClick={() => setView("laptop")}
            className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
          >
            Laptop View
          </button>
          <button
            onClick={() => setView("mobile")}
            className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
          >
            Mobile View
          </button>
          <button
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            className="bg-gray-700 text-white px-3 py-2 rounded text-sm"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>

      <div
        className={`
        border border-gray-700 rounded-xl shadow-lg p-8
        ${view === "desktop" ? "w-full max-w-screen-lg" : ""}
        ${view === "laptop" ? "w-[1024px] max-w-full" : ""}
        ${view === "mobile" ? "w-[375px] max-w-full" : ""}
      `}
      >
        <form onSubmit={handleSubmit}>
          <Step
            currentStep={currentStep}
            stepData={formData}
            setFormData={setFormData}
            errors={errors}
            theme={theme}
          />

          {formData.fields &&
            formData.fields.map((field, index) => (
              <div key={index} className="mb-6">
                <label className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => {
                    const updatedFields = [...formData.fields];
                    updatedFields[index].value = e.target.value;
                    const updatedFormData = {
                      ...formData,
                      fields: updatedFields,
                    };
                    setFormData(updatedFormData);
                    localStorage.setItem(
                      FORM_DATA_STORAGE_KEY,
                      JSON.stringify(updatedFormData)
                    );
                  }}
                  className="mt-1 border-2 block w-60 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {field.helpText}
                </p>
                {errors[`dynamicField${index}`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`dynamicField${index}`]}
                  </p>
                )}
              </div>
            ))}

          {currentStep === steps.length - 1 && (
            <div className="my-4 space-y-2">
              <input
                type="text"
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                placeholder="Field Name"
                className="block w-full border p-2 rounded dark:bg-gray-700"
              />
              <input
                type="text"
                value={helpText}
                onChange={(e) => setHelpText(e.target.value)}
                placeholder="Help Text"
                className="block w-full border p-2 rounded dark:bg-gray-700"
              />
              <input
                type="text"
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Error Message"
                className="block w-full border p-2 rounded dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={handleAddField}
                className="bg-blue-500 text-white p-2 rounded"
              >
                + Add Field
              </button>
            </div>
          )}

          <div className="flex justify-between mt-4 flex-wrap gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="bg-yellow-500 text-white p-3 rounded"
            >
              Clear
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white p-3 rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white p-3 rounded"
              >
                Submit
              </button>
            )}
          </div>
        </form>

        {submitted && submittedData && (
          <div className="mt-6 inline-block border border-green-500 rounded bg-green-100 text-green-800 p-4 w-full overflow-x-auto">
            <h2 className="text-lg font-semibold mb-2">Form submitted</h2>
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
            <p>Shareable Form ID: {submittedData.formId}</p>
            <p>
              Access the form at:{" "}
              <a
                href={submittedData.shareableUrl}
                target="_blank"
                className="text-blue-500 underline"
              >
                {submittedData.shareableUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepperForm;
