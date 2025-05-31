import FormField from "./FormField";

const Step = ({ currentStep, stepData, setFormData, errors, theme }) => {
  const handleChange = (field) => (e) => {
    setFormData({ [field]: e.target.value });
  };

  switch (currentStep) {
    case 0:
      return (
        <>
          <FormField
            label="First Name"
            helpText="Enter your first name"
            value={stepData.firstName}
            onChange={handleChange("firstName")}
            error={errors.firstName}
            required
            theme={theme}
          />
          <FormField
            label="Last Name"
            helpText="Enter your last name"
            value={stepData.lastName}
            onChange={handleChange("lastName")}
            error={errors.lastName}
            required
            theme={theme}
          />
          <FormField
            label="Email"
            type="email"
            helpText="Enter your email id"
            value={stepData.email}
            onChange={handleChange("email")}
            error={errors.email}
            required
            theme={theme}
          />
          <FormField
            label="Phone Number"
            helpText="Enter your 10 digit mobile no"
            type="tel"
            value={stepData.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            required
            theme={theme}
          />
        </>
      );
    case 1:
      return (
        <>
          <FormField
            label="Previous Internship Experience"
            helpText="Have you done any previous internship?"
            value={stepData.prevInternExperience}
            onChange={handleChange("prevInternExperience")}
            error={errors.prevInternExperience}
            required
            theme={theme}
            type="select"
            options={["Yes", "No"]}
          />
          <FormField
            label="How Many Months You Want to Intern?"
            helpText="Choose the number of months you wish to intern."
            value={stepData.internshipDuration}
            onChange={handleChange("internshipDuration")}
            type="select"
            options={["2", "6"]}
            error={errors.internshipDuration}
            required
            theme={theme}
          />
        </>
      );
    case 2:
      return (
        <FormField
          label="About Yourself"
          type="textarea"
          value={stepData.aboutYourself}
          onChange={handleChange("aboutYourself")}
          error={errors.aboutYourself}
          required
          theme={theme}
        />
      );
    default:
      return null;
  }
};

export default Step;
