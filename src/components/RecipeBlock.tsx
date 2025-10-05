'use client'; // This component is interactive, so it must be a Client Component.

import { useState, useEffect } from 'react';
import { FiPrinter, FiSun, FiMoon } from 'react-icons/fi';

// A simple, self-contained star rating component.
function StarRating({ rating = 0, count = 0, author = '' }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2 text-sm text-gray-600">
            <div className="flex text-yellow-500 text-lg">
                {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
                {halfStar && <span className="text-gray-300">★</span>} {/* Simplified half-star for display */}
                {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`}>☆</span>)}
            </div>
            <div className="flex-grow text-center sm:text-left">
                <span><strong>{rating}</strong> from <strong>{count}</strong> votes</span>
                {author && <span> – by {author}</span>}
            </div>
        </div>
    );
}


// --- MAIN RECIPE BLOCK COMPONENT ---
export default function RecipeBlock({ fields, recipeTitle }: { fields: any, recipeTitle: string }) {
    // If no fields data is passed, render nothing to avoid errors.
    if (!fields) {
        return null;
    }

    // --- STATE MANAGEMENT ---
    // State for tracking which ingredients are checked off.
    const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
    // State for toggling "Cook Mode".
    const [isCookMode, setIsCookMode] = useState(false);

    // --- WAKE LOCK LOGIC (using native browser API) ---
    useEffect(() => {
        // This holds the wake lock object once it's acquired.
        let wakeLockSentinel: any = null;

        const manageWakeLock = async () => {
            // Check if the browser supports the Screen Wake Lock API.
            if ('wakeLock' in navigator) {
                if (isCookMode) {
                    try {
                        // Request a screen wake lock.
                        wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
                        console.log('Screen Wake Lock is active.');
                    } catch (err: any) {
                        console.error(`Screen Wake Lock failed: ${err.name}, ${err.message}`);
                    }
                } else {
                    // If Cook Mode is turned off, release the lock if we have one.
                    if (wakeLockSentinel) {
                        wakeLockSentinel.release().then(() => {
                            wakeLockSentinel = null;
                            console.log('Screen Wake Lock released.');
                        });
                    }
                }
            } else {
                console.warn('Screen Wake Lock API is not supported by this browser.');
            }
        };

        // Run the function to either acquire or release the lock.
        manageWakeLock();

        // This is a cleanup function that runs when the component unmounts or re-renders.
        // It ensures the lock is always released if the user navigates away.
        return () => {
            if (wakeLockSentinel) {
                wakeLockSentinel.release().then(() => {
                    wakeLockSentinel = null;
                });
            }
        };
    }, [isCookMode]); // This effect re-runs every time the `isCookMode` state changes.

    // --- DATA PROCESSING ---
    // Process the text area fields from ACF into arrays, filtering out any accidental empty lines.
    const ingredientsList = fields.ingredients?.split('\n').filter((item: string) => item.trim() !== '') || [];
    const instructionsList = fields.instructions?.split('\n').filter((step: string) => step.trim() !== '') || [];
    const equipmentList = fields.equipment?.split('\n').filter((item: string) => item.trim() !== '') || [];

    // --- EVENT HANDLERS ---
    const handleCheckboxChange = (index: number) => {
        setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handlePrint = () => {
        window.print();
    };

    const toggleCookMode = () => {
        setIsCookMode(prev => !prev);
    };

    // --- RENDER ---
    return (
        <div id="recipe-block" className="bg-rose-50 p-4 sm:p-8 rounded-lg border-2 border-rose-200 mt-12 recipe-card-print">
            
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-rose-800">
                    {recipeTitle}
                </h2>
                <StarRating rating={fields.rating} count={fields.ratingCount} author={fields.authorName} />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <button onClick={handlePrint} className="w-full bg-rose-200 text-rose-800 font-bold py-3 px-4 rounded hover:bg-rose-300 transition-colors flex items-center justify-center gap-2">
                    <FiPrinter /> Print Recipe
                </button>
                <button onClick={toggleCookMode} className={`w-full font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 ${isCookMode ? 'bg-yellow-400 text-yellow-900' : 'bg-rose-200 text-rose-800 hover:bg-rose-300'}`}>
                    {isCookMode ? <FiMoon /> : <FiSun />} Cook Mode {isCookMode ? 'On' : 'Off'}
                </button>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-y-2 border-rose-200 py-4">
                <div><strong className="block text-rose-800">Prep Time:</strong> {fields.prepTime}</div>
                <div><strong className="block text-rose-800">Cook Time:</strong> {fields.cookingTime}</div>
                <div><strong className="block text-rose-800">Total Time:</strong> {fields.totalTime}</div>
                <div><strong className="block text-rose-800">Servings:</strong> {fields.servings}</div>
            </div>
            <div className="grid grid-cols-2 text-center border-b-2 border-rose-200 py-4">
                <div><strong className="block text-rose-800">Course:</strong> {fields.course}</div>
                <div><strong className="block text-rose-800">Cuisine:</strong> {fields.cuisine}</div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Left Column: Equipment & Ingredients */}
                <div className="md:col-span-1">
                    {equipmentList.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-serif font-bold text-rose-800 mb-4">Equipment</h3>
                            <ul className="space-y-2">
                                {equipmentList.map((item: string, index: number) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <input type="checkbox" className="h-4 w-4 rounded border-gray-400 text-rose-600 focus:ring-rose-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <h3 className="text-2xl font-serif font-bold text-rose-800 mb-4">Ingredients</h3>
                    <ul className="space-y-2">
                        {ingredientsList.map((item: string, index: number) => (
                            <li key={index} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id={`ingredient-${index}`}
                                    checked={!!checkedIngredients[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                    className="h-4 w-4 rounded border-gray-400 text-rose-600 focus:ring-rose-500"
                                />
                                <label htmlFor={`ingredient-${index}`} className={`transition-colors ${checkedIngredients[index] ? 'line-through text-gray-500' : ''}`}>
                                    {item}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Right Column: Instructions */}
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-serif font-bold text-rose-800 mb-4">Instructions</h3>
                    <ol className="list-none space-y-6">
                        {instructionsList.map((step: string, index: number) => (
                            <li key={index} className="flex items-start gap-4">
                                <span className="flex-shrink-0 bg-rose-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">{index + 1}</span>
                                <p className="flex-grow pt-1">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Notes Section */}
            {fields.notes && (
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h3 className="text-2xl font-serif font-bold text-rose-800 mb-4">Notes</h3>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: fields.notes }} />
                </div>
            )}
        </div>
    );
}