
import React, { useState } from 'react';
import { ProductInstanceData } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { DocumentMagnifyingGlassIcon } from './icons/DocumentMagnifyingGlassIcon';
import { TrashIcon } from './icons/TrashIcon'; // New Icon

interface ProductInstanceMenuProps {
  isOpen: boolean;
  instances: ProductInstanceData[];
  activeInstanceId: string | null;
  onSelectInstance: (instanceId: string) => void;
  onDeleteInstance: (instanceId: string) => void;
  onClose: () => void;
}

interface ProductInstanceMenuItemProps {
  instance: ProductInstanceData;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ProductInstanceMenuItem: React.FC<ProductInstanceMenuItemProps> = ({ instance, isActive, onSelect, onDelete }) => {
  const [isVanishing, setIsVanishing] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing
    setIsVanishing(true);
    // Wait for animation to mostly complete before calling delete
    setTimeout(() => {
        onDelete();
        // setIsVanishing(false); // Component will be unmounted by parent
    }, 350); // Match animation duration
  };

  return (
    <li className={`product-instance-menu-item ${isVanishing ? 'product-instance-item-vanishing' : ''}`}>
      <button
        onClick={onSelect}
        className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-md transition-colors duration-150 ease-in-out group
          ${isActive 
            ? 'bg-sky-600/40 text-sky-100 ring-2 ring-sky-500 shadow-lg' 
            : 'text-gray-300 hover:bg-gray-700/70 hover:text-sky-300 focus:bg-gray-700/70 focus:text-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-500'
          }
        `}
        aria-current={isActive ? "page" : undefined}
        disabled={isVanishing}
      >
        <span className="flex items-center min-w-0"> {/* min-w-0 for truncate to work in flex */}
          {instance.isLoading || instance.isCompetitorLoading ? (
            <svg className="animate-spin flex-shrink-0 -ml-0.5 mr-2.5 h-4 w-4 text-sky-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2.5 text-gray-400 group-hover:text-sky-400 transition-colors flex-shrink-0" />
          )}
          <span className="truncate font-roboto-mono text-sm">
            {instance.productName || `Product Session #${instance.id.substring(instance.id.length - 4)}`}
          </span>
        </span>
        <span className="flex items-center flex-shrink-0">
          {isActive && !isVanishing && (
            <CheckIcon className="w-5 h-5 text-sky-300 flex-shrink-0 mr-2" />
          )}
          <button
            onClick={handleDeleteClick}
            disabled={isVanishing}
            className={`p-1.5 rounded-full text-gray-400 hover:text-red-400 focus:text-red-400 hover:bg-red-700/30 focus:bg-red-700/40 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-150 ${isVanishing ? 'opacity-0' : ''}`}
            aria-label={`Delete investigation for ${instance.productName || 'this product'}`}
            title={`Delete ${instance.productName || 'this product'}`}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </span>
      </button>
    </li>
  );
};


const ProductInstanceMenu: React.FC<ProductInstanceMenuProps> = ({ 
  isOpen,
  instances, 
  activeInstanceId, 
  onSelectInstance,
  onDeleteInstance,
  onClose
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 product-menu-overlay" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div 
        className="fixed top-20 left-4 max-w-sm bg-gray-800/90 border border-gray-700/80 rounded-xl shadow-2xl z-50 overflow-hidden product-instance-menu-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-menu-title"
      >
        <div className="p-4 border-b border-gray-700">
          <h2 id="product-menu-title" className="text-lg font-semibold text-sky-300 font-orbitron text-center">
            Switch Investigation
          </h2>
        </div>
        <ul className="max-h-[min(60vh,400px)] overflow-y-auto p-2 space-y-1 custom-scrollbar-column custom-scrollbar-primary">
          {instances.length > 0 ? (
            instances.map(instance => (
              <ProductInstanceMenuItem
                key={instance.id}
                instance={instance}
                isActive={instance.id === activeInstanceId}
                onSelect={() => onSelectInstance(instance.id)}
                onDelete={() => onDeleteInstance(instance.id)}
              />
            ))
          ) : (
            <li className="p-4 text-center text-gray-500 font-roboto-mono text-sm">
              No active investigations. Click '+' in the header to start one.
            </li>
          )}
        </ul>
         <div className="p-3 border-t border-gray-700/50 text-center bg-gray-800/50">
            <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-gray-400 hover:text-sky-300 font-roboto-mono rounded-md hover:bg-gray-700/60 focus:bg-gray-700/70 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors"
                aria-label="Close product selection menu"
            >
                Close Menu
            </button>
        </div>
      </div>
    </>
  );
};

export default ProductInstanceMenu;
