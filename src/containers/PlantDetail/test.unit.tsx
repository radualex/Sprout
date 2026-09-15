import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { makePlant } from '@test/vitest/data/plant.mock';

// Components
import PlantDetail from './index';

// Database
import { markCareDone } from '@/lib/db/actions';

vi.mock('next/navigation', () => {
    return {
        useRouter: () => {
            return {
                push: vi.fn(),
                refresh: vi.fn()
            };
        }
    };
});

vi.mock('@/lib/db/actions', () => {
    return {
        deletePlant: vi.fn(),
        markCareDone: vi.fn(),
        updatePlant: vi.fn()
    };
});

describe('PlantDetail', () => {
    it('shows a notice when logging care fails', async () => {
        const user = userEvent.setup();
        vi.mocked(markCareDone).mockRejectedValue(new Error('db down'));

        render(<PlantDetail plant={makePlant()} />);
        await user.click(screen.getByRole('button', {
            name: 'Watered today'
        }));

        expect(await screen.findByText('Couldn\'t log that care. Please try again.')).toBeInTheDocument();
    });
});
