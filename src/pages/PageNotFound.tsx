export default function NotFound() 
{
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bebas-neue text-gray-800">IhateGinga</h1>
            <p className="text-lg font-montserrat text-gray-600 mb-6">
                Out of bounds ka na erp
            </p>
            <a
                href="/home"
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-montserrat"
            >
                Go Home
            </a>
        </div>
    );
}
