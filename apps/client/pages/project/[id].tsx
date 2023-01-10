import { useQuery } from '@tanstack/react-query';
import { tmutate, tquery } from '../../tgql';
import React, { useEffect, useMemo, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { QueryMode } from '@wallet-collector/generated/zeus';
import * as ethers from 'ethers';
import { GetServerSideProps } from 'next';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import useAuthUser from '../../hooks/useAuthUser';

export const getServerSideProps: GetServerSideProps = async (c) => {
  return { props: { id: +(c.query.id as string) } };
};

const ProjectPage = ({ id }: { id: number }) => {
  // const queryClient = useQueryClient();
  const [newAddresses, setNewAddresses] = useState('');
  const [isNewAddressesValid, setIsNewAddressesValid] = useState(true);
  const [queryAddress, setQueryAddress] = useState('');
  const [queryFound, setQueryFound] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const isValidAddress = useMemo(
    () => (queryAddress ? ethers.utils.isAddress(queryAddress) : true),
    [queryAddress]
  );

  const { authUser } = useAuthUser();

  useEffect(() => {
    if (newAddresses) {
      setIsNewAddressesValid(
        newAddresses
          .split(',')
          .map((a) => a.trim())
          .every(ethers.utils.isAddress)
      );
    }
  }, [newAddresses]);

  const { data, status } = useQuery({
    queryFn: () =>
      tquery({
        getOneProject: [
          { where: { id } },
          {
            name: true,
            author: { username: true },
          },
        ],
      }).then((res) => res.getOneProject),
    queryKey: ['project', id],
  });

  useDebounce(
    async () => {
      if (!queryAddress) {
        setQueryFound(false);
        return;
      }
      setQueryLoading(true);
      await tquery({
        walletAddressExists: [
          {
            where: {
              projectId: { equals: id },
              address: { equals: queryAddress, mode: QueryMode.insensitive },
            },
          },
          true,
        ],
      })
        .then((res) => res.walletAddressExists)
        .then(setQueryFound)
        .catch(() => toast.error('Error Searching For Address'));
      setQueryLoading(false);
    },
    700,
    [queryAddress]
  );

  useDebounce(() => setQueryLoading(true), 0, [queryAddress]);

  const addAddresses = async (addresses: string[]) => {
    await toast.promise(
      tmutate({
        addWalletAddresses: [
          { data: addresses.map((address) => ({ address, projectId: id })) },
          true,
        ],
      }),
      { loading: 'Updating...', error: 'Error', success: 'Success' }
    );
    // await queryClient.invalidateQueries(['project', id]);
  };

  const handleAddqueriedAddress = () => {
    addAddresses([queryAddress]);
    setQueryAddress('');
  };

  const handleAddNewAddresses = () => {
    addAddresses(
      newAddresses
        .split(',')
        .map((a) => a.trim())
        .filter(ethers.utils.isAddress)
    );
    setNewAddresses('');
  };

  const handleExport = async () => {
    axios({
      url: `${process.env.NEXT_PUBLIC_API}api/csv-export/${id}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    })
      .then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch(() => toast.error('Error exporting CSV'));
  };

  return (
    <div className="p-4">
      {/* {status === 'success' &&
        data.walletAddresses &&
        data.walletAddresses.length > 0 && (
        )} */}
      {!!authUser && (
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="text-sm text-blue-600 hover:text-white hover:bg-blue-600 transition-colors rounded p-1"
          >
            Export CSV
          </button>
        </div>
      )}
      {status === 'success' && (
        <h1 className="text-2xl text-center font-bold">
          Project : {data.name || '<No Name>'}
        </h1>
      )}
      <div className="mx-auto">
        <input
          placeholder="Query Address"
          className="border-2 border-gray-300 rounded w-[600px]"
          type="text"
          value={queryAddress}
          onChange={(e) => setQueryAddress(e.target.value.trim())}
        />
        {!isValidAddress && (
          <p className="text-sm text-red-800">Invalid Wallet Address</p>
        )}
        {!queryLoading && isValidAddress && (
          <div className="flex items-center gap-3 text-sm mt-2">
            {!!queryAddress && (
              <p>
                {queryFound
                  ? 'Address already added'
                  : 'Queried Address not found'}
              </p>
            )}
            {!!queryAddress && !queryFound && isValidAddress && (
              <button
                onClick={handleAddqueriedAddress}
                className="bg-blue-700 rounded p-1 text-white"
              >
                Add It
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <div>
          <input
            type="text"
            className="border-2 border-gray-300 rounded w-[600px]"
            placeholder="Add New Addresses (Comma Separated)"
            value={newAddresses}
            onChange={(e) => setNewAddresses(e.target.value)}
          />
          {newAddresses && !isNewAddressesValid && (
            <p className="text-sm text-red-700">Contains Invalid Address(es)</p>
          )}
        </div>
        {newAddresses && isNewAddressesValid && (
          <button
            onClick={handleAddNewAddresses}
            className="bg-blue-700 text-white p-2 rounded"
          >
            Add
          </button>
        )}
      </div>

      {/* <ol>
        {status === 'success' &&
          data.walletAddresses?.map((w) => (
            <li className="flex items-end gap-3" key={w.address}>
              <h1>{w.address}</h1>
              {w.addedBy && (
                <h2 className="text-sm">
                  added by {w.addedBy.username || w.addedBy.email}
                </h2>
              )}
            </li>
          ))}
      </ol> */}
    </div>
  );
};

export default ProjectPage;
