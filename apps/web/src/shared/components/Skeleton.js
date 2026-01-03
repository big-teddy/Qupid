import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
/**
 * Skeleton loader component for loading states
 */
export const Skeleton = ({
  className = "",
  variant = "rectangle",
  width,
  height,
  count = 1,
}) => {
  const baseClass = "skeleton";
  const variantClasses = {
    text: "skeleton-text",
    circle: "skeleton-circle",
    card: "skeleton-card",
    rectangle: "",
  };
  const style = {
    width: width,
    height: height,
  };
  const elements = Array.from({ length: count }, (_, index) =>
    _jsx(
      "div",
      {
        className: `${baseClass} ${variantClasses[variant]} ${className}`,
        style: style,
      },
      index,
    ),
  );
  return _jsx(_Fragment, { children: elements });
};
/**
 * Card skeleton for persona cards, coaching cards, etc.
 */
export const CardSkeleton = ({ className = "" }) =>
  _jsxs("div", {
    className: `bg-white rounded-2xl p-4 ${className}`,
    children: [
      _jsxs("div", {
        className: "flex items-center gap-3 mb-4",
        children: [
          _jsx(Skeleton, { variant: "circle", width: 48, height: 48 }),
          _jsxs("div", {
            className: "flex-1",
            children: [
              _jsx(Skeleton, { variant: "text", width: "60%" }),
              _jsx(Skeleton, { variant: "text", width: "40%" }),
            ],
          }),
        ],
      }),
      _jsx(Skeleton, { variant: "text", count: 2 }),
      _jsx(Skeleton, { variant: "text", width: "75%" }),
    ],
  });
/**
 * Chat message skeleton
 */
export const MessageSkeleton = ({ isUser = false }) =>
  _jsxs("div", {
    className: `flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`,
    children: [
      !isUser && _jsx(Skeleton, { variant: "circle", width: 32, height: 32 }),
      _jsx(Skeleton, {
        className: isUser ? "ml-auto" : "",
        width: isUser ? "60%" : "70%",
        height: 60,
      }),
    ],
  });
/**
 * List item skeleton
 */
export const ListItemSkeleton = () =>
  _jsxs("div", {
    className: "flex items-center gap-3 p-4 border-b border-gray-100",
    children: [
      _jsx(Skeleton, { variant: "circle", width: 40, height: 40 }),
      _jsxs("div", {
        className: "flex-1",
        children: [
          _jsx(Skeleton, { variant: "text", width: "50%" }),
          _jsx(Skeleton, { variant: "text", width: "80%" }),
        ],
      }),
      _jsx(Skeleton, { width: 60, height: 24 }),
    ],
  });
/**
 * Profile skeleton
 */
export const ProfileSkeleton = () =>
  _jsxs("div", {
    className: "flex flex-col items-center p-6",
    children: [
      _jsx(Skeleton, {
        variant: "circle",
        width: 80,
        height: 80,
        className: "mb-4",
      }),
      _jsx(Skeleton, { variant: "text", width: 120, className: "mb-2" }),
      _jsx(Skeleton, { variant: "text", width: 180 }),
    ],
  });
/**
 * Stats card skeleton
 */
export const StatsSkeleton = () =>
  _jsx("div", {
    className: "grid grid-cols-3 gap-4",
    children: [1, 2, 3].map((i) =>
      _jsxs(
        "div",
        {
          className: "flex flex-col items-center p-3 bg-gray-50 rounded-xl",
          children: [
            _jsx(Skeleton, { width: 40, height: 40, className: "mb-2" }),
            _jsx(Skeleton, { variant: "text", width: 60 }),
          ],
        },
        i,
      ),
    ),
  });
export default Skeleton;
