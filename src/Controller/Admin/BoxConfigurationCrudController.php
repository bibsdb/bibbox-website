<?php

namespace App\Controller\Admin;

use App\Entity\BoxConfiguration;
use App\Utils\Types\LanguageCodes;
use App\Utils\Types\LoginMethods;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Class BoxConfigurationCrudController.
 */
class BoxConfigurationCrudController extends AbstractCrudController
{
    private $router;

    public function __construct(UrlGeneratorInterface $router)
    {
        $this->router = $router;
    }

    /**
     * Get entity fqcn.
     *
     * @return string
     */
    public static function getEntityFqcn(): string
    {
        return BoxConfiguration::class;
    }

    /**
     * Configure fields.
     *
     * @param string $pageName
     *
     * @return iterable
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            FormField::addPanel('Configuration'),
                TextField::new('uniqueId')->setFormTypeOption('disabled','disabled')
                    ->formatValue(function ($value, $entity) {
                        return $this->router->generate('box_configuration', ['uniqueId' => $value], UrlGeneratorInterface::ABSOLUTE_URL);
                    }),

            FormField::addPanel('Details'),
                IdField::new('id')->hideOnForm()->hideOnIndex(),
                TextField::new('name'),
                AssociationField::new('school'),
                AssociationField::new('sip2User'),
                TextField::new('reservedMaterialInstruction'),
                TextField::new('defaultPassword')->hideOnIndex(),

            FormField::addPanel('Options'),
                BooleanField::new('hasTouch')->hideOnIndex(),
                BooleanField::new('hasKeyboard')->hideOnIndex(),
                BooleanField::new('hasPrinter')->hideOnIndex(),
                BooleanField::new('soundEnabled')->hideOnIndex(),
                BooleanField::new('debugEnabled'),
                IntegerField::new('inactivityTimeOut')->hideOnIndex(),
                ChoiceField::new('loginMethod')
                    ->setChoices(LoginMethods::getLoginMethodList())
                    ->hideOnIndex(),
                ChoiceField::new('defaultLanguageCode')
                    ->setChoices(array_flip(LanguageCodes::getLanguageCodeList()))
                    ->hideOnIndex(),
        ];
    }

    /**
     * Configure filters.
     *
     * @param Filters $filters
     *
     * @return Filters
     */
    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add('name')
            ->add('school')
            ->add('sip2User');
    }
}
