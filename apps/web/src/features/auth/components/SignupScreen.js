import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@qupid/ui";
import { Eye, EyeOff } from "lucide-react";
import SocialLoginButtons from "./SocialLoginButtons";
import { useNavigate } from "react-router-dom";
const SignupScreen = ({ onSignupSuccess }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: 소셜/이메일 선택, 2: 상세정보, 3: 성별선택
    // 게스트 데이터가 있으면 가져오기
    const guestGender = localStorage.getItem("guestGender") || "";
    const guestPartnerGender = localStorage.getItem("guestPartnerGender") || "";
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        user_gender: guestGender || "",
        partner_gender: guestPartnerGender ||
            "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [socialLoading, setSocialLoading] = useState(false);
    // 실시간 유효성 검사
    const [validation, setValidation] = useState({
        email: { valid: false, message: "" },
        password: { valid: false, strength: 0 },
    });
    // 이메일 유효성 검사
    useEffect(() => {
        if (!formData.email) {
            setValidation((prev) => ({ ...prev, email: { valid: false, message: "" } }));
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(formData.email);
        setValidation((prev) => ({
            ...prev,
            email: {
                valid: isValid,
                message: isValid ? "" : "올바른 이메일 형식이 아닙니다",
            },
        }));
    }, [formData.email]);
    // 비밀번호 강도 검사
    useEffect(() => {
        if (!formData.password) {
            setValidation((prev) => ({ ...prev, password: { valid: false, strength: 0 } }));
            return;
        }
        let strength = 0;
        if (formData.password.length >= 6)
            strength++;
        if (formData.password.length >= 8)
            strength++;
        if (/[A-Z]/.test(formData.password))
            strength++;
        if (/[0-9]/.test(formData.password))
            strength++;
        if (/[^A-Za-z0-9]/.test(formData.password))
            strength++;
        setValidation((prev) => ({
            ...prev,
            password: {
                valid: formData.password.length >= 6,
                strength: Math.min(strength, 4),
            },
        }));
    }, [formData.password]);
    const getPasswordStrengthLabel = () => {
        const labels = ["", "약함", "보통", "강함", "매우 강함"];
        return labels[validation.password.strength];
    };
    const getPasswordStrengthColor = () => {
        const colors = ["", "bg-red-400", "bg-yellow-400", "bg-green-400", "bg-green-600"];
        return colors[validation.password.strength];
    };
    const handleEmailNext = () => {
        if (!validation.email.valid) {
            setErrors({ email: "올바른 이메일을 입력해주세요" });
            return;
        }
        setErrors({});
        setStep(2);
    };
    const handleDetailsNext = () => {
        const newErrors = {};
        if (!formData.name)
            newErrors.name = "이름을 입력해주세요";
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = "비밀번호는 6자 이상이어야 합니다";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setStep(3);
    };
    const handleSignup = async () => {
        setErrors({});
        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    user_gender: formData.user_gender,
                    partner_gender: formData.partner_gender,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "회원가입에 실패했습니다.");
            }
            // 회원가입 성공
            if (data.data.session) {
                localStorage.setItem("authToken", data.data.session.access_token);
                localStorage.setItem("refreshToken", data.data.session.refresh_token);
                localStorage.setItem("userId", data.data.user.id);
            }
            // 프로필 저장
            if (data.data.profile) {
                localStorage.setItem("userProfile", JSON.stringify(data.data.profile));
                // 게스트 데이터 정리
                ["guestId", "guestGender", "guestPartnerGender", "guestExperience",
                    "guestConfidence", "guestDifficulty", "guestInterests",
                    "guestTutorialCompleted", "guestChatCount", "hasCompletedOnboarding"
                ].forEach((key) => localStorage.removeItem(key));
                const guestTutorialCompleted = localStorage.getItem("guestTutorialCompleted") === "true";
                if (data.data.profile.is_tutorial_completed || guestTutorialCompleted) {
                    onSignupSuccess(data.data);
                    navigate("/home");
                }
                else {
                    onSignupSuccess(data.data);
                    navigate("/tutorial");
                }
            }
            else {
                onSignupSuccess(data.data);
                navigate("/onboarding");
            }
        }
        catch (err) {
            setErrors({
                general: err instanceof Error ? err.message : "회원가입에 실패했습니다",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setErrors({});
        }
        else {
            navigate("/login");
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-white flex flex-col", children: [_jsxs("header", { className: "px-6 py-4 flex items-center", children: [_jsx("button", { onClick: handleBack, className: "mr-4 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(ArrowLeftIcon, { className: "w-6 h-6 text-[#191F28]" }) }), step > 1 && (_jsx("div", { className: "flex space-x-1.5 flex-1 justify-center mr-10", children: [1, 2, 3].map((s) => (_jsx("div", { className: `h-1 rounded-full transition-all ${s <= step ? "bg-[#F093B0] w-8" : "bg-[#E5E8EB] w-4"}` }, s))) }))] }), _jsxs("main", { className: "flex-1 px-6 py-4", children: [step === 1 && (_jsxs("div", { className: "animate-fade-in", children: [_jsx("h1", { className: "text-2xl font-bold text-[#191F28] mb-2", children: "\uC2DC\uC791\uD558\uAE30" }), _jsx("p", { className: "text-[#8B95A1] mb-8", children: "\uAC04\uD3B8\uD558\uAC8C \uC2DC\uC791\uD558\uACE0 \uB300\uD654 \uC2A4\uD0AC\uC744 \uD5A5\uC0C1\uC2DC\uD0A4\uC138\uC694" }), _jsx(SocialLoginButtons, { onLoadingChange: setSocialLoading }), _jsxs("div", { className: "my-8 flex items-center", children: [_jsx("div", { className: "flex-1 h-px bg-[#E5E8EB]" }), _jsx("span", { className: "px-4 text-sm text-[#8B95A1]", children: "\uB610\uB294" }), _jsx("div", { className: "flex-1 h-px bg-[#E5E8EB]" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "\uC774\uBA54\uC77C \uC8FC\uC18C", className: `w-full h-14 px-4 pr-10 rounded-xl border transition-all text-base ${errors.email
                                                            ? "border-red-400 focus:border-red-400"
                                                            : formData.email && validation.email.valid
                                                                ? "border-green-400 focus:border-green-400"
                                                                : "border-[#E5E8EB] focus:border-[#F093B0]"} focus:outline-none` }), formData.email && validation.email.valid && (_jsx("span", { className: "absolute right-4 top-1/2 -translate-y-1/2 text-green-500", children: "\u2713" }))] }), errors.email && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.email })), formData.email && !validation.email.valid && validation.email.message && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: validation.email.message }))] }), _jsx("button", { onClick: handleEmailNext, disabled: !formData.email || socialLoading, className: `w-full h-14 rounded-xl font-bold text-base transition-all ${formData.email && validation.email.valid && !socialLoading
                                            ? "bg-[#F093B0] text-white hover:bg-[#DB7093]"
                                            : "bg-[#E5E8EB] text-[#8B95A1] cursor-not-allowed"}`, children: "\uC774\uBA54\uC77C\uB85C \uACC4\uC18D\uD558\uAE30" })] }), _jsxs("p", { className: "text-center text-sm text-[#8B95A1] mt-8", children: ["\uC774\uBBF8 \uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694?", " ", _jsx("button", { onClick: () => navigate("/login"), className: "text-[#F093B0] font-medium hover:underline", children: "\uB85C\uADF8\uC778" })] })] })), step === 2 && (_jsxs("div", { className: "animate-fade-in", children: [_jsx("h1", { className: "text-2xl font-bold text-[#191F28] mb-2", children: "\uD504\uB85C\uD544 \uC124\uC815" }), _jsx("p", { className: "text-[#8B95A1] mb-8", children: "\uB2F9\uC2E0\uC5D0 \uB300\uD574 \uC870\uAE08 \uC54C\uB824\uC8FC\uC138\uC694" }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#191F28] mb-2", children: "\uC774\uB984" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "\uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694", className: `w-full h-14 px-4 rounded-xl border transition-all text-base ${errors.name ? "border-red-400" : "border-[#E5E8EB]"} focus:border-[#F093B0] focus:outline-none` }), errors.name && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.name }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#191F28] mb-2", children: "\uBE44\uBC00\uBC88\uD638" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? "text" : "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), placeholder: "6\uC790 \uC774\uC0C1 \uC785\uB825\uD574\uC8FC\uC138\uC694", className: `w-full h-14 px-4 pr-12 rounded-xl border transition-all text-base ${errors.password ? "border-red-400" : "border-[#E5E8EB]"} focus:border-[#F093B0] focus:outline-none` }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-[#8B95A1] hover:text-[#191F28] transition-colors", children: showPassword ? (_jsx(EyeOff, { className: "w-5 h-5" })) : (_jsx(Eye, { className: "w-5 h-5" })) })] }), errors.password && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.password })), formData.password && (_jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "flex space-x-1 mb-1", children: [1, 2, 3, 4].map((level) => (_jsx("div", { className: `h-1 flex-1 rounded-full transition-all ${level <= validation.password.strength
                                                                ? getPasswordStrengthColor()
                                                                : "bg-[#E5E8EB]"}` }, level))) }), _jsxs("p", { className: "text-xs text-[#8B95A1]", children: ["\uBE44\uBC00\uBC88\uD638 \uAC15\uB3C4: ", getPasswordStrengthLabel()] })] }))] })] })] })), step === 3 && (_jsxs("div", { className: "animate-fade-in", children: [_jsx("h1", { className: "text-2xl font-bold text-[#191F28] mb-2", children: "\uB9C8\uC9C0\uB9C9 \uB2E8\uACC4" }), _jsx("p", { className: "text-[#8B95A1] mb-8", children: "\uB9DE\uCDA4\uD615 \uB300\uD654 \uC5F0\uC2B5\uC744 \uC704\uD574 \uC54C\uB824\uC8FC\uC138\uC694" }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-[#191F28] mb-4", children: "\uB2F9\uC2E0\uC758 \uC131\uBCC4\uC740?" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                                                    { value: "male", label: "남성", emoji: "👨" },
                                                    { value: "female", label: "여성", emoji: "👩" },
                                                ].map((option) => (_jsxs("button", { onClick: () => setFormData({
                                                        ...formData,
                                                        user_gender: option.value,
                                                    }), className: `p-5 rounded-2xl border-2 transition-all ${formData.user_gender === option.value
                                                        ? "border-[#F093B0] bg-[#FDF2F8]"
                                                        : "border-[#E5E8EB] bg-white hover:border-[#F093B0]/50"}`, children: [_jsx("p", { className: "text-3xl mb-2", children: option.emoji }), _jsx("p", { className: "font-bold text-[#191F28]", children: option.label })] }, option.value))) })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-[#191F28] mb-4", children: "\uB300\uD654 \uC5F0\uC2B5\uC744 \uC6D0\uD558\uB294 \uC0C1\uB300 \uC131\uBCC4\uC740?" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                                                    { value: "male", label: "남성", emoji: "👨" },
                                                    { value: "female", label: "여성", emoji: "👩" },
                                                ].map((option) => (_jsxs("button", { onClick: () => setFormData({
                                                        ...formData,
                                                        partner_gender: option.value,
                                                    }), className: `p-5 rounded-2xl border-2 transition-all ${formData.partner_gender === option.value
                                                        ? "border-[#F093B0] bg-[#FDF2F8]"
                                                        : "border-[#E5E8EB] bg-white hover:border-[#F093B0]/50"}`, children: [_jsx("p", { className: "text-3xl mb-2", children: option.emoji }), _jsx("p", { className: "font-bold text-[#191F28]", children: option.label })] }, option.value))) })] })] })] })), errors.general && (_jsx("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded-xl", children: _jsx("p", { className: "text-sm text-red-600", children: errors.general }) }))] }), step > 1 && (_jsx("div", { className: "px-6 pb-8 pt-4", children: _jsx("button", { onClick: step === 2 ? handleDetailsNext : handleSignup, disabled: (step === 2 && (!formData.name || !validation.password.valid)) ||
                        (step === 3 && (!formData.user_gender || !formData.partner_gender)) ||
                        isLoading, className: `w-full h-14 rounded-xl font-bold text-base transition-all ${((step === 2 && formData.name && validation.password.valid) ||
                        (step === 3 && formData.user_gender && formData.partner_gender)) &&
                        !isLoading
                        ? "bg-[#F093B0] text-white hover:bg-[#DB7093]"
                        : "bg-[#E5E8EB] text-[#8B95A1] cursor-not-allowed"}`, children: isLoading ? "처리 중..." : step === 3 ? "시작하기" : "다음" }) }))] }));
};
export { SignupScreen };
export default SignupScreen;
