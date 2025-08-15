import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BlockchainSuccessView, CreatedBlockchain } from '../../../src/components/blockchain/BlockchainSuccessView';

describe('BlockchainSuccessView', () => {
  const blockchain: CreatedBlockchain = {
    id: '1',
    name: 'Test Blockchain',
    symbol: 'TB',
    description: 'A test blockchain',
    difficulty: 2,
    reward: 50,
    maxSupply: 1000000,
    blocks: [],
    createdAt: new Date().toISOString(),
    published: false,
  };

  it('should render the blockchain details correctly', () => {
    const { getByTestId } = render(
      <BlockchainSuccessView
        blockchain={blockchain}
        onDownload={() => {}}
        onPublish={() => {}}
        onCreateAnother={() => {}}
        isDownloading={false}
      />
    );

    expect(getByTestId('blockchain-name')).toHaveTextContent('Test Blockchain');
    expect(getByTestId('detail-name')).toHaveTextContent('Test Blockchain');
    expect(getByTestId('detail-symbol')).toHaveTextContent('TB');
    expect(getByTestId('detail-description')).toHaveTextContent('A test blockchain');
    expect(getByTestId('detail-difficulty')).toHaveTextContent('2');
    expect(getByTestId('detail-reward')).toHaveTextContent('50');
    expect(getByTestId('blockchain-status')).toHaveTextContent('Active');
  });

  it('should call the onDownload function when the download button is clicked', () => {
    const onDownload = jest.fn();
    const { getByTestId } = render(
      <BlockchainSuccessView
        blockchain={blockchain}
        onDownload={onDownload}
        onPublish={() => {}}
        onCreateAnother={() => {}}
        isDownloading={false}
      />
    );

    fireEvent.click(getByTestId('download-button'));
    expect(onDownload).toHaveBeenCalled();
  });

  it('should call the onPublish function when the publish button is clicked', () => {
    const onPublish = jest.fn();
    const { getByTestId } = render(
      <BlockchainSuccessView
        blockchain={blockchain}
        onDownload={() => {}}
        onPublish={onPublish}
        onCreateAnother={() => {}}
        isDownloading={false}
      />
    );

    fireEvent.click(getByTestId('publish-button'));
    expect(onPublish).toHaveBeenCalled();
  });

  it('should call the onCreateAnother function when the create another button is clicked', () => {
    const onCreateAnother = jest.fn();
    const { getByTestId } = render(
      <BlockchainSuccessView
        blockchain={blockchain}
        onDownload={() => {}}
        onPublish={() => {}}
        onCreateAnother={onCreateAnother}
        isDownloading={false}
      />
    );

    fireEvent.click(getByTestId('create-another-button'));
    expect(onCreateAnother).toHaveBeenCalled();
  });
});