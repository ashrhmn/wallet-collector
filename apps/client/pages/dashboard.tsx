import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SortOrder } from '@wallet-collector/generated/zeus';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout';
import useAuthUser from '../hooks/useAuthUser';
import { tmutate, tquery } from '../tgql';

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [newProjectName, setNewProjectName] = useState('');
  const { data: projects, status } = useQuery({
    queryFn: () =>
      tquery({
        getUserProjects: [
          { orderBy: [{ id: SortOrder.asc }] },
          { name: true, id: true, _count: { walletAddresses: true } },
        ],
      }).then((res) => res.getUserProjects),
    queryKey: ['user-projects', authUser?.id],
  });

  const handleNewProjectCreate = async () => {
    if (!newProjectName) {
      toast.error('Invalid Project Name');
      return;
    }

    await tmutate({
      createUserProject: [{ data: { name: newProjectName } }, { id: true }],
    });

    setNewProjectName('');

    queryClient.invalidateQueries(['user-projects', authUser?.id]);
  };

  const handleDeleteProject = async (id: number) => {
    await tmutate({ deleteProject: [{ where: { id } }, true] });
    queryClient.invalidateQueries(['user-projects', authUser?.id]);
  };

  return (
    <AuthLayout>
      <div className="p-4">
        <h1>Dashboard</h1>
        <div className="py-2 flex gap-3 items-center">
          <input
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            type="text"
            placeholder="New Project"
            className="border-2 border-gray-300 rounded w-60"
          />
          <button
            onClick={handleNewProjectCreate}
            className="bg-blue-700 rounded text-white p-1"
          >
            Create
          </button>
        </div>
        <div className="flex flex-wrap">
          {status === 'success' &&
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-200 p-3 m-2 mt-8 rounded"
              >
                <Link href={`/project/${project.id}`}>
                  <h1>Project : {project.name}</h1>
                  <h2>Address Count : {project._count.walletAddresses}</h2>
                </Link>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteProject(+project.id)}
                    className="text-sm hover:text-white hover:bg-red-700 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Dashboard;
