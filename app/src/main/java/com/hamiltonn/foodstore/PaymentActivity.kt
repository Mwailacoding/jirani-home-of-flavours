package com.hamiltonn.foodstore

import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.loopj.android.http.RequestParams

class PaymentActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_payment)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
//        fetch two text views
        val name=findViewById<TextView>(R.id.name)
        val cost=findViewById<TextView>(R.id.cost)
        val phone=findViewById<TextView>(R.id.phone)
        val pay=findViewById<Button>(R.id.pay)
        val photo=findViewById<ImageView>(R.id.product_photo)
//        retrive product name and product cost
        val name1=intent.getStringExtra("product_name")
        val cost1=intent.getIntExtra("product_cost",0)
        val product_photo=intent.getStringExtra("product_photo")
        val imageUrl = "https://hamilton06.pythonanywhere.com/static/images/${product_photo}"

        //Load image using Glide, Load Faster with Glide
        Glide.with(applicationContext)
            .load(imageUrl )
            .placeholder(R.drawable.ic_launcher_background) // Make sure you have a placeholder image
            .into(photo)

//        replace product name with real value
    name.text=name1
        cost.text="$cost1"
//        set on click listener to  the button
    pay.setOnClickListener {
        val api="https://hamilton06.pythonanywhere.com/api/mpesa_payment"
        val data=RequestParams()
        data.put("amount",cost.text.toString())
        data.put("phone",phone.text.toString())
        val helper = ApiHelper(applicationContext)
        helper.post_login(api,data)

    }

    }
}