import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout';
import { tmutate } from '../tgql';

const ChangePasswordPage = () => {
  const [payload, setPayload] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const handleUpdatePassword = async () => {
    try {
      const { confirmNewPassword, newPassword } = payload;
      if (newPassword !== confirmNewPassword)
        throw 'Both Passwords do not match';

      await tmutate({ changePassword: [payload, true] });
      toast.success('Password Updated!');
    } catch (error) {
      if (typeof error === 'string') toast.error(error);
      else {
        try {
          (error as any[])
            .map((v: any) => v.message)
            .filter((msg) => typeof msg === 'string')
            .forEach((msg) => toast.error(msg));
        } catch {
          console.log({ error });
        }
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full h-[100vh] flex justify-center items-center">
        <div className="bg-gray-200 p-3 rounded">
          <div className="mt-2 flex flex-col items-start gap-1">
            <label>Old Password</label>
            <input
              className="border-2 border-gray-200 rounded p-1"
              type="password"
              value={payload.oldPassword}
              onChange={(e) =>
                setPayload((p) => ({ ...p, oldPassword: e.target.value }))
              }
            />
          </div>
          <div className="mt-2 flex flex-col items-start gap-1">
            <label>New Password</label>
            <input
              className="border-2 border-gray-200 rounded p-1"
              type="password"
              value={payload.newPassword}
              onChange={(e) =>
                setPayload((p) => ({ ...p, newPassword: e.target.value }))
              }
            />
          </div>
          <div className="mt-2 flex flex-col items-start gap-1">
            <label>Confirm New Password</label>
            <input
              className="border-2 border-gray-200 rounded p-1"
              type="password"
              value={payload.confirmNewPassword}
              onChange={(e) =>
                setPayload((p) => ({
                  ...p,
                  confirmNewPassword: e.target.value,
                }))
              }
            />
          </div>

          <div className="mt-2 flex justify-center">
            <button
              onClick={handleUpdatePassword}
              className="bg-blue-700 text-white rounded p-1"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ChangePasswordPage;
