interface EmptyStateProps {
    message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
    return (
        <div className="text-center text-gray-500 py-4">
            <p>{message}</p>
        </div>
    );
}
