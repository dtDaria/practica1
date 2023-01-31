Vue.component('product-details',{
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template:
        `<ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>`
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">
	<div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
        <div class="product-info">
            <h1>{{ title }} </h1> <!-- загаловок -->
            <p>{{ description }} <a :href="link">More products like this</a></p> <!-- Ссылка на магазин -->
            <span v-if="onSale">{{sale}}</span> <!-- товар находится на скидке -->
            <span v-else>noSale</span> <!-- товар не находится на скидке -->
            <p v-if="inStock">In stock</p> <!-- товар нахдится в наличии -->
            <p v-else :class="{outOfStock: !instock}">Out of stock</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li> <!-- состав -->
            </ul>
            <p>Shipping: {{ shipping }}</p>
            <!-- цвет -->
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)">
            </div>
            <ul>
                <li v-for="size in sizes">{{size}}</li><!-- размеры -->
            </ul>
            <div class="cart"> <!-- кол товаров в кор -->
                <p>Cart({{ cart }})</p>
            </div>
            <button v-on:click="addToCart" :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to cart</button><!-- добавить в кор -->

            <button v-on:click="deleteToCart">Remove cart</button> <!-- убрать из кор -->

        </div>
   </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],

            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                    variantOnSale: "on Sale",
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite (1).jpg",
                    variantQuantity: 0,
                    variantOnSale: "Want to buy? Wait a little bit",
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
            OnSale:"on Sale",
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        deleteToCart() {
            if (this.cart >0) {
                this.cart -= 1
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale(){
            return this.brand + '  ' + this.product + '  ' + this.variants[this.selectedVariant].variantOnSale;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },

    }
})




let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})





 
 