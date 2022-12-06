import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tmutate, tquery } from '../../tgql';
import React, { useEffect, useMemo, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { QueryMode } from '@wallet-collector/generated/zeus';
import * as ethers from 'ethers';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (c) => {
  return { props: { id: +(c.query.id as string) } };
};

const ProjectPage = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const [newAddresses, setNewAddresses] = useState('');
  const [isNewAddressesValid, setIsNewAddressesValid] = useState(true);
  const [queryAddress, setQueryAddress] = useState('');
  const [queryFound, setQueryFound] = useState(false);
  const isValidAddress = useMemo(
    () => (queryAddress ? ethers.utils.isAddress(queryAddress) : true),
    [queryAddress]
  );

  useEffect(() => {
    if (newAddresses) {
      setIsNewAddressesValid(
        newAddresses.split(',').every(ethers.utils.isAddress)
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
            walletAddresses: {
              address: true,
              addedBy: { username: true, email: true },
            },
            author: { username: true },
          },
        ],
      }).then((res) => res.getOneProject),
    queryKey: ['project', id],
  });

  useDebounce(
    () => {
      if (!queryAddress) {
        setQueryFound(false);
        return;
      }
      tquery({
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
        .then(setQueryFound);
    },
    700,
    [queryAddress]
  );

  const addAddresses = async (addresses: string[]) => {
    await tmutate({
      addWalletAddresses: [
        { data: addresses.map((address) => ({ address, projectId: id })) },
        true,
      ],
    });
    await queryClient.invalidateQueries(['project', id]);
  };

  const handleAddqueriedAddress = () => {
    addAddresses([queryAddress]);
    setQueryAddress('');
  };

  const handleAddNewAddresses = () => {
    addAddresses(newAddresses.split(',').filter(ethers.utils.isAddress));
    setNewAddresses('');
  };

  return (
    <div className="p-4">
      {status === 'success' &&
        data.walletAddresses &&
        data.walletAddresses.length > 0 && (
          <div className="flex justify-end">
            <a
              className="text-sm text-blue-600 hover:text-white hover:bg-blue-600 transition-colors rounded p-1"
              href={`${process.env.NEXT_PUBLIC_API}api/csv-export/${id}`}
            >
              Export CSV
            </a>
          </div>
        )}
      <h1 className="text-2xl text-center font-bold">Project : {data?.name}</h1>
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
      <div className="mx-auto">
        <input
          placeholder="Query Address"
          className="border-2 border-gray-300 rounded w-[600px]"
          type="text"
          value={queryAddress}
          onChange={(e) => setQueryAddress(e.target.value)}
        />
        {!isValidAddress && (
          <p className="text-sm text-red-800">Invalid Wallet Address</p>
        )}
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
      </div>
      <ol>
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
      </ol>
    </div>
  );
};

export default ProjectPage;
