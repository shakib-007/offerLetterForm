import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormCheckbox from './FormCheckbox';

const JOB_ROLES = [
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'Senior Software Engineer', label: 'Senior Software Engineer' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Intern', label: 'Intern' },
];

const EMPLOYMENT_TYPES = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' },
];

const LOCATIONS = [
    { value: 'Dhaka', label: 'Dhaka' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Chittagong', label: 'Chittagong' },
];

const BENEFITS_OPTIONS = [
    'Medical Insurance',
    'Provident Fund',
    'Performance Bonus',
    'Laptop Provided',
];

const OfferForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        employment_type: '',
        location: '',
        joining_date: '',
        salary: '',
        benefits: [],
        manager_approved: false,
        finance_approved: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.employment_type) newErrors.employment_type = 'Employment Type is required';
        if (!formData.location) newErrors.location = 'Location is required';

        if (!formData.joining_date) {
            newErrors.joining_date = 'Joining Date is required';
        } else {
            const date = new Date(formData.joining_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date <= today) {
                newErrors.joining_date = 'Joining Date must be in the future';
            }
        }

        if (!formData.salary) {
            newErrors.salary = 'Salary is required';
        } else if (Number(formData.salary) <= 0) {
            newErrors.salary = 'Salary must be greater than 0';
        }

        if (!formData.manager_approved) newErrors.manager_approved = 'Manager approval is required';
        if (!formData.finance_approved) newErrors.finance_approved = 'Finance approval is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (id === 'manager_approved' || id === 'finance_approved') {
                setFormData(prev => ({ ...prev, [id]: checked }));
            } else {
                // Benefits logic could be tricky if they were individual checkboxes, 
                // but usually benefits are a multi-select or list of checkboxes.
                // Let's implement benefits as individual checkboxes mapped in render?
                // Actually, if id is just 'Medical Insurance', it maps to nothing in state directly.
                // Let's handle benefits separately in specific handler or check ID.
            }
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }

        // Clear error when user types
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleBenefitChange = (benefit) => {
        setFormData(prev => {
            const benefits = prev.benefits.includes(benefit)
                ? prev.benefits.filter(b => b !== benefit)
                : [...prev.benefits, benefit];
            return { ...prev, benefits };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // Convert salary/bonus to numbers
            const payload = {
                ...formData,
                salary: Number(formData.salary),
            };
            console.log(payload);

            await axios.post('https://shakiburrahman10.app.n8n.cloud/webhook-test/create-offer-letter', payload);

            setSubmitStatus('success');
            setFormData({
                name: '', email: '', phone: '', role: '', employment_type: '', location: '',
                joining_date: '', salary: '', bonus: '', benefits: [],
                manager_approved: false, finance_approved: false
            });
        } catch (error) {
            console.error('Submission failed', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800">New Offer Submission</h2>
                <p className="text-slate-500 mt-1">Enter candidate details and offer terms</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Candidate Info */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Candidate Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            id="name" label="Full Name" placeholder="John Doe"
                            value={formData.name} onChange={handleChange} error={errors.name} required
                        />
                        <FormInput
                            id="email" label="Email Address" type="email" placeholder="john@example.com"
                            value={formData.email} onChange={handleChange} error={errors.email} required
                        />
                        <FormInput
                            id="phone" label="Phone Number" placeholder="+880 1..."
                            value={formData.phone} onChange={handleChange} error={errors.phone} required
                        />
                    </div>
                </section>

                {/* Job Details */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Job Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormSelect
                            id="role" label="Role" options={JOB_ROLES}
                            value={formData.role} onChange={handleChange} error={errors.role} required
                        />
                        <FormSelect
                            id="employment_type" label="Employment Type" options={EMPLOYMENT_TYPES}
                            value={formData.employment_type} onChange={handleChange} error={errors.employment_type} required
                        />
                        <FormSelect
                            id="location" label="Location" options={LOCATIONS}
                            value={formData.location} onChange={handleChange} error={errors.location} required
                        />
                        <FormInput
                            id="joining_date" label="Joining Date" type="date"
                            value={formData.joining_date} onChange={handleChange} error={errors.joining_date} required
                        />
                    </div>
                </section>

                {/* Compensation */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Compensation & Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            id="salary" label="Monthly Salary" type="number" placeholder="0.00"
                            value={formData.salary} onChange={handleChange} error={errors.salary} required
                        />

                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Benefits</label>
                        <div className="grid grid-cols-2 gap-2">
                            {BENEFITS_OPTIONS.map(benefit => (
                                <div key={benefit} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`benefit-${benefit}`}
                                        checked={formData.benefits.includes(benefit)}
                                        onChange={() => handleBenefitChange(benefit)}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`benefit-${benefit}`} className="text-sm text-slate-700 cursor-pointer">
                                        {benefit}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Approvals */}
                <section className="space-y-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h3 className="text-lg font-semibold text-yellow-800 pb-2">Approvals Check</h3>
                    <div className="flex flex-col md:flex-row gap-6">
                        <FormCheckbox
                            id="manager_approved"
                            label="Manager Approved"
                            checked={formData.manager_approved}
                            onChange={handleChange}
                            error={errors.manager_approved}
                            required
                        />
                        <FormCheckbox
                            id="finance_approved"
                            label="Finance Approved"
                            checked={formData.finance_approved}
                            onChange={handleChange}
                            error={errors.finance_approved}
                            required
                        />
                    </div>
                </section>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
                        <CheckCircle size={20} />
                        <span>Offer request submitted successfully</span>
                    </div>
                )}
                {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                        <AlertTriangle size={20} />
                        <span>Failed to submit offer request. Please try again.</span>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed",
                            isSubmitting && "cursor-wait"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Offer'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OfferForm;
