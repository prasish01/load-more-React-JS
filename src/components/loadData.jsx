import { useEffect, useState } from "react";

export default function LoadData() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);

  const loadMoreProducts = () => {
    // Log to confirm if count changes on button click
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      console.log("Incremented count:", newCount);
      return newCount;
    });
  };

  useEffect(() => {
    async function fetchProducts() {
      console.log("Fetching data with count:", count, "and skip:", count * 20);
      try {
        setLoading(true);
        const response = await fetch(
          `https://dummyjson.com/products?limit=20&skip=${count * 20}`
        );
        const result = await response.json();

        if (result && result.products) {
          // Add products while avoiding duplicates
          setProducts((prev) => [
            ...prev,
            ...result.products.filter(
              (product) => !prev.some((p) => p.id === product.id)
            ),
          ]);
          console.log("Products fetched:", result.products.length);
        }
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [count]); // Only fetch when 'count' changes

  // Debug re-renders and loading state
  console.log("Component rendered with count:", count);

  if (loading) {
    return <p>Loading data! Please wait.</p>;
  }

  return (
    <div className="container">
      <div>
        {products && products.length > 0 ? (
          products.map((item) => (
            <div key={item.id}>
              <img src={item.thumbnail} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <div className="button-container">
        <button onClick={loadMoreProducts}>Load More Products</button>
      </div>
    </div>
  );
}
