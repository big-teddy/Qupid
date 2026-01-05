import React, { useState, useEffect } from "react";
import { UserProfile } from "@qupid/core";
import { ArrowLeftIcon } from "@qupid/ui";
import { Eye, EyeOff } from "lucide-react";
import SocialLoginButtons from "./SocialLoginButtons";
import { useNavigate } from "react-router-dom";

interface SignupScreenProps {
  onSignupSuccess: (userData: { profile?: UserProfile }) => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 소셜/이메일 선택, 2: 상세정보, 3: 성별선택

  // 게스트 데이터가 있으면 가져오기
  const guestGender = localStorage.getItem("guestGender") || "";
  const guestPartnerGender = localStorage.getItem("guestPartnerGender") || "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    user_gender:
      (guestGender as "male" | "female") || ("" as "male" | "female" | ""),
    partner_gender:
      (guestPartnerGender as "male" | "female") ||
      ("" as "male" | "female" | ""),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    if (formData.password.length >= 6) strength++;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;

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
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "이름을 입력해주세요";
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
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
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

        const guestTutorialCompleted =
          localStorage.getItem("guestTutorialCompleted") === "true";
        if (data.data.profile.is_tutorial_completed || guestTutorialCompleted) {
          onSignupSuccess(data.data);
          navigate("/home");
        } else {
          onSignupSuccess(data.data);
          navigate("/tutorial");
        }
      } else {
        onSignupSuccess(data.data);
        navigate("/onboarding");
      }
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "회원가입에 실패했습니다",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <header className="px-6 py-4 flex items-center">
        <button onClick={handleBack} className="mr-4 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-[#191F28]" />
        </button>
        {step > 1 && (
          <div className="flex space-x-1.5 flex-1 justify-center mr-10">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all ${s <= step ? "bg-[#F093B0] w-8" : "bg-[#E5E8EB] w-4"
                  }`}
              />
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 px-6 py-4">
        {/* Step 1: 소셜 로그인 우선 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-[#191F28] mb-2">
              시작하기
            </h1>
            <p className="text-[#8B95A1] mb-8">
              간편하게 시작하고 대화 스킬을 향상시키세요
            </p>

            {/* 소셜 로그인 - 최상단 */}
            <SocialLoginButtons onLoadingChange={setSocialLoading} />

            {/* 구분선 */}
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-[#E5E8EB]" />
              <span className="px-4 text-sm text-[#8B95A1]">또는</span>
              <div className="flex-1 h-px bg-[#E5E8EB]" />
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="이메일 주소"
                    className={`w-full h-14 px-4 pr-10 rounded-xl border transition-all text-base ${errors.email
                      ? "border-red-400 focus:border-red-400"
                      : formData.email && validation.email.valid
                        ? "border-green-400 focus:border-green-400"
                        : "border-[#E5E8EB] focus:border-[#F093B0]"
                      } focus:outline-none`}
                  />
                  {formData.email && validation.email.valid && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                      ✓
                    </span>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
                {formData.email && !validation.email.valid && validation.email.message && (
                  <p className="text-sm text-red-500 mt-1">{validation.email.message}</p>
                )}
              </div>

              <button
                onClick={handleEmailNext}
                disabled={!formData.email || socialLoading}
                className={`w-full h-14 rounded-xl font-bold text-base transition-all ${formData.email && validation.email.valid && !socialLoading
                  ? "bg-[#F093B0] text-white hover:bg-[#DB7093]"
                  : "bg-[#E5E8EB] text-[#8B95A1] cursor-not-allowed"
                  }`}
              >
                이메일로 계속하기
              </button>
            </div>

            {/* 로그인 링크 */}
            <p className="text-center text-sm text-[#8B95A1] mt-8">
              이미 계정이 있으신가요?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#F093B0] font-medium hover:underline"
              >
                로그인
              </button>
            </p>
          </div>
        )}

        {/* Step 2: 상세 정보 입력 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-[#191F28] mb-2">
              프로필 설정
            </h1>
            <p className="text-[#8B95A1] mb-8">
              당신에 대해 조금 알려주세요
            </p>

            <div className="space-y-5">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="이름을 입력해주세요"
                  className={`w-full h-14 px-4 rounded-xl border transition-all text-base ${errors.name ? "border-red-400" : "border-[#E5E8EB]"
                    } focus:border-[#F093B0] focus:outline-none`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* 비밀번호 - 표시 토글 포함 */}
              <div>
                <label className="block text-sm font-medium text-[#191F28] mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="6자 이상 입력해주세요"
                    className={`w-full h-14 px-4 pr-12 rounded-xl border transition-all text-base ${errors.password ? "border-red-400" : "border-[#E5E8EB]"
                      } focus:border-[#F093B0] focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B95A1] hover:text-[#191F28] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}

                {/* 비밀번호 강도 표시 */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${level <= validation.password.strength
                            ? getPasswordStrengthColor()
                            : "bg-[#E5E8EB]"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#8B95A1]">
                      비밀번호 강도: {getPasswordStrengthLabel()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 성별 선택 */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-[#191F28] mb-2">
              마지막 단계
            </h1>
            <p className="text-[#8B95A1] mb-8">
              맞춤형 대화 연습을 위해 알려주세요
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-[#191F28] mb-4">
                  당신의 성별은?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "male", label: "남성", emoji: "👨" },
                    { value: "female", label: "여성", emoji: "👩" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          user_gender: option.value as "male" | "female",
                        })
                      }
                      className={`p-5 rounded-2xl border-2 transition-all ${formData.user_gender === option.value
                        ? "border-[#F093B0] bg-[#FDF2F8]"
                        : "border-[#E5E8EB] bg-white hover:border-[#F093B0]/50"
                        }`}
                    >
                      <p className="text-3xl mb-2">{option.emoji}</p>
                      <p className="font-bold text-[#191F28]">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#191F28] mb-4">
                  대화 연습을 원하는 상대 성별은?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "male", label: "남성", emoji: "👨" },
                    { value: "female", label: "여성", emoji: "👩" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          partner_gender: option.value as "male" | "female",
                        })
                      }
                      className={`p-5 rounded-2xl border-2 transition-all ${formData.partner_gender === option.value
                        ? "border-[#F093B0] bg-[#FDF2F8]"
                        : "border-[#E5E8EB] bg-white hover:border-[#F093B0]/50"
                        }`}
                    >
                      <p className="text-3xl mb-2">{option.emoji}</p>
                      <p className="font-bold text-[#191F28]">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {errors.general && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}
      </main>

      {/* 하단 버튼 - Step 2, 3에서만 표시 */}
      {step > 1 && (
        <div className="px-6 pb-8 pt-4">
          <button
            onClick={step === 2 ? handleDetailsNext : handleSignup}
            disabled={
              (step === 2 && (!formData.name || !validation.password.valid)) ||
              (step === 3 && (!formData.user_gender || !formData.partner_gender)) ||
              isLoading
            }
            className={`w-full h-14 rounded-xl font-bold text-base transition-all ${((step === 2 && formData.name && validation.password.valid) ||
              (step === 3 && formData.user_gender && formData.partner_gender)) &&
              !isLoading
              ? "bg-[#F093B0] text-white hover:bg-[#DB7093]"
              : "bg-[#E5E8EB] text-[#8B95A1] cursor-not-allowed"
              }`}
          >
            {isLoading ? "처리 중..." : step === 3 ? "시작하기" : "다음"}
          </button>
        </div>
      )}
    </div>
  );
};

export { SignupScreen };
export default SignupScreen;
