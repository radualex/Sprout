import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { makePlant, NOW } from '@test/vitest/data/plant.mock';

// Components
import CareLogRow from './index';

// Types
import { CareKind } from '@/types';

describe('CareLogRow', () => {
    it('renders the care label and the done button', () => {
        const plant = makePlant();
        const handleDone = vi.fn();

        render(<CareLogRow plant={plant} kind={CareKind.Water} now={NOW} onDone={handleDone} />);

        expect(screen.getByText('Water')).toBeInTheDocument();
        expect(screen.getByText('Last watered today')).toBeInTheDocument();
        expect(screen.getByRole('button', {
            name: 'Watered today'
        })).toBeInTheDocument();
    });

    it('calls onDone with the care kind when the button is clicked', async () => {
        const plant = makePlant();
        const handleDone = vi.fn();
        const user = userEvent.setup();

        render(<CareLogRow plant={plant} kind={CareKind.Water} now={NOW} onDone={handleDone} />);
        await user.click(screen.getByRole('button', {
            name: 'Watered today'
        }));

        expect(handleDone).toHaveBeenCalledWith(CareKind.Water);
    });
});
