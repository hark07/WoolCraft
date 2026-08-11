import { categoriesData } from "../assets/assets";

function Categories() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-pink-600 font-medium text-sm mb-2">
            Explore Our Collection
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Shop By Category
          </h2>

          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Explore our beautiful handmade wool crafts made with love.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categoriesData.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.id}
                className="group bg-pink-50 border border-pink-100 rounded-2xl p-6 text-center cursor-pointer hover:bg-pink-600 hover:border-pink-600 hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-pink-100 transition">
                  <Icon className="text-pink-600 text-3xl group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Name */}
                <h3 className="mt-5 text-lg font-semibold text-gray-800 group-hover:text-white transition">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-500 group-hover:text-pink-100 transition">
                  {category.description}
                </p>

                {/* Explore */}
                <span className="inline-block mt-4 text-sm font-semibold text-pink-600 group-hover:text-white transition">
                  Explore →
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
