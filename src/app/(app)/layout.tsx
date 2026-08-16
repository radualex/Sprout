// Components
import { BottomNav } from '@/js/components/BottomNav';

interface Props {
    children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
    return (
        <div className="appShell">
            {children}
            <BottomNav dueCount={0} />
        </div>
    );
};

export default AppLayout;
