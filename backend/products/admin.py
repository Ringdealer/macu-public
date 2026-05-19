from django.contrib import admin
from django import forms  # new
from django.utils.html import format_html  # new
from .models import Category, Product


# ✅ CUSTOM FORM TO HANDLE CHARACTERISTICS CLEANLY
class ProductAdminForm(forms.ModelForm):  # new
    characteristics_description = forms.CharField(  # new
        label="Descripción (Características)",  # new
        required=False,  # new
        widget=forms.Textarea(attrs={"rows": 3}),  # new
    )

    class Meta:
        model = Product
        fields = "__all__"

    def __init__(self, *args, **kwargs):  # new
        super().__init__(*args, **kwargs)

        # Pre-fill from JSONField
        if self.instance and self.instance.characteristics:  # new
            self.fields["characteristics_description"].initial = (  # new
                self.instance.characteristics.get("description", "")  # new
            )

    def clean(self):  # new
        cleaned_data = super().clean()

        description = cleaned_data.get("characteristics_description")

        # Save back into JSONField
        if description:  # new
            cleaned_data["characteristics"] = {  # new
                "description": description  # new
            }
        else:
            cleaned_data["characteristics"] = None  # new

        return cleaned_data


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm  # new

    list_display = (
        "name",
        "category",
        "price",
        "stock",
        "available",
        "image_preview",  # new
        "created_at",
        "updated_at",
    )

    list_filter = (
        "category",
        "available",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
        "uuid",
    )

    readonly_fields = (
        "uuid",
        "updated_at",
        "image_preview",  # new
    )

    ordering = ("-updated_at",)

    # =========================
    # 🖼️ CLOUDINARY PREVIEW
    # =========================
    def image_preview(self, obj):  # new
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:80px; border-radius:8px;" />',
                obj.image.url
            )
        return "No image"

    image_preview.short_description = "Image"  # new