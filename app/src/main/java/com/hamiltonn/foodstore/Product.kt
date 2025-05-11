package com.hamiltonn.foodstore

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import org.json.JSONArray

//Define individual product varaibles
data class Product(
    val id: Int,
    val name: String,
    val category:  String?,
    val price: Int,
    val foodphoto: String?
)

class ProductAdapter(private val productList: List<Product>) :
    RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {
    //Find Views by ID from  Single Item XML Layout
    class ProductViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val txtName: TextView = itemView.findViewById(R.id.product_name)
        val txtDesc: TextView = itemView.findViewById(R.id.product_description)
        val txtPrice: TextView = itemView.findViewById(R.id.product_cost)
        val imgProduct: ImageView = itemView.findViewById(R.id.product_photo)
        val btnPurchase: TextView = itemView.findViewById(R.id.purchase)
    }
    //Access the Layout - Single Item
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.single_item, parent, false)
        return ProductViewHolder(view)
    }

    //Access Views in Single Item XML and Bind Data
    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = productList[position]
        holder.txtName.text = product.name
        holder.txtDesc.text = product.category ?: "No description"
        holder.txtPrice.text = "Ksh ${product.price}"
        //Change/Replace modcom2 below to your Python Anywhere username
        val imageUrl = "https://hamilton06.pythonanywhere.com/static/images/${product.foodphoto}"

        //Load image using Glide, Load Faster with Glide
        Glide.with(holder.itemView.context)
            .load(imageUrl )
            .placeholder(R.drawable.ic_launcher_background) // Make sure you have a placeholder image
            .into(holder.imgProduct)

        //Handle Purchase Button Listener
        holder.btnPurchase.setOnClickListener {
            val context = holder.itemView.context
            val intent = android.content.Intent(context, PaymentActivity::class.java).apply {
                putExtra("product_id", product.id)
                putExtra("product_name", product.name)
                putExtra("product_description", product.category)
                putExtra("product_cost", product.price)
                putExtra("product_photo", product.foodphoto)
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = productList.size
   //Return all products Details as a LIST
    companion object {
        fun fromJsonArray(jsonArray: JSONArray): List<Product> {
            val list = mutableListOf<Product>()
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                list.add(
                    Product(
                        id = obj.getInt("id"),
                        name = obj.getString("name"),
                        category = obj.optString("category", ""),
                        price = obj.getInt("price"),
                        foodphoto = obj.optString("foodphoto", "")
                    )
                )
            }
            return list
        }
    }
}





